const express = require('express');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const { getOne, getAll, runQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const { blogValidation } = require('../middleware/validation');

const router = express.Router();

// Generate unique slug
const generateUniqueSlug = async (title, currentId = null) => {
  let slug = slugify(title, { lower: true, strict: true });
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    const existing = await getOne('SELECT id FROM blogs WHERE slug = ?', [uniqueSlug]);
    if (!existing || existing.id === currentId) {
      return uniqueSlug;
    }
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
};

// Public: Get all published blogs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT id, slug, title, excerpt, featured_image, author, 
             published_at, updated_at, status, meta_title, meta_description, tags
      FROM blogs 
      WHERE status = 'published'
    `;
    let countSql = `SELECT COUNT(*) as total FROM blogs WHERE status = 'published'`;
    const params = [];

    if (search) {
      sql += ` AND (title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)`;
      countSql += ` AND (title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY published_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const blogs = await getAll(sql, params);
    const countResult = await getOne(countSql, search ? [`%${search}%`, `%${search}%`, `%${search}%`] : []);

    // Parse tags JSON
    const parsedBlogs = blogs.map(blog => ({
      ...blog,
      tags: blog.tags ? JSON.parse(blog.tags) : [],
    }));

    res.json({
      success: true,
      data: {
        blogs: parsedBlogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
    });
  }
});

// Public: Get single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await getOne(`
      SELECT id, slug, title, excerpt, content, featured_image, author,
             published_at, updated_at, status, meta_title, meta_description, tags
      FROM blogs 
      WHERE slug = ? AND status = 'published'
    `, [slug]);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.json({
      success: true,
      data: {
        ...blog,
        tags: blog.tags ? JSON.parse(blog.tags) : [],
      },
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
    });
  }
});

// Protected: Get all blogs (including drafts)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const blogs = await getAll(`
      SELECT b.*, u.name as creator_name
      FROM blogs b
      LEFT JOIN users u ON b.created_by = u.id
      ORDER BY b.created_at DESC
    `);

    res.json({
      success: true,
      data: {
        blogs: blogs.map(blog => ({
          ...blog,
          tags: blog.tags ? JSON.parse(blog.tags) : [],
        })),
      },
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
    });
  }
});

// Protected: Create blog
router.post('/', authenticateToken, blogValidation, async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      featuredImage,
      author,
      status = 'draft',
      metaTitle,
      metaDescription,
      tags = [],
    } = req.body;

    const slug = await generateUniqueSlug(title);
    const blogId = uuidv4();
    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    await runQuery(`
      INSERT INTO blogs (
        id, slug, title, excerpt, content, featured_image, author,
        published_at, status, meta_title, meta_description, tags, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      blogId,
      slug,
      title,
      excerpt,
      content,
      featuredImage || null,
      author,
      publishedAt,
      status,
      metaTitle || title,
      metaDescription || excerpt,
      JSON.stringify(tags),
      req.user.id,
    ]);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: {
        id: blogId,
        slug,
        title,
        status,
      },
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog',
    });
  }
});

// Protected: Update blog
router.put('/:id', authenticateToken, blogValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      featuredImage,
      author,
      status,
      metaTitle,
      metaDescription,
      tags = [],
    } = req.body;

    const existingBlog = await getOne('SELECT * FROM blogs WHERE id = ?', [id]);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const slug = title !== existingBlog.title 
      ? await generateUniqueSlug(title, id)
      : existingBlog.slug;

    const publishedAt = status === 'published' && existingBlog.status === 'draft'
      ? new Date().toISOString()
      : existingBlog.published_at;

    await runQuery(`
      UPDATE blogs SET
        slug = ?,
        title = ?,
        excerpt = ?,
        content = ?,
        featured_image = ?,
        author = ?,
        published_at = ?,
        status = ?,
        meta_title = ?,
        meta_description = ?,
        tags = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      slug,
      title,
      excerpt,
      content,
      featuredImage || existingBlog.featured_image,
      author,
      publishedAt,
      status,
      metaTitle || title,
      metaDescription || excerpt,
      JSON.stringify(tags),
      id,
    ]);

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: {
        id,
        slug,
        title,
        status,
      },
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog',
    });
  }
});

// Protected: Delete blog
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const existingBlog = await getOne('SELECT * FROM blogs WHERE id = ?', [id]);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    await runQuery('DELETE FROM blogs WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
    });
  }
});

module.exports = router;
