const express = require('express');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const { getOne, getAll, runQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const { caseStudyValidation } = require('../middleware/validation');

const router = express.Router();

// Generate unique slug
const generateUniqueSlug = async (title, currentId = null) => {
  let slug = slugify(title, { lower: true, strict: true });
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    const existing = await getOne('SELECT id FROM case_studies WHERE slug = ?', [uniqueSlug]);
    if (!existing || existing.id === currentId) {
      return uniqueSlug;
    }
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
};

// Public: Get all published case studies
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, industry = '' } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT id, slug, title, subtitle, excerpt, featured_image, 
             client_name, industry, duration, results,
             published_at, updated_at, status, meta_title, meta_description
      FROM case_studies 
      WHERE status = 'published'
    `;
    let countSql = `SELECT COUNT(*) as total FROM case_studies WHERE status = 'published'`;
    const params = [];

    if (industry) {
      sql += ` AND industry = ?`;
      countSql += ` AND industry = ?`;
      params.push(industry);
    }

    sql += ` ORDER BY published_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const caseStudies = await getAll(sql, params);
    const countResult = await getOne(countSql, industry ? [industry] : []);

    // Parse results JSON
    const parsedCaseStudies = caseStudies.map(cs => ({
      ...cs,
      results: cs.results ? JSON.parse(cs.results) : [],
    }));

    res.json({
      success: true,
      data: {
        caseStudies: parsedCaseStudies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get case studies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case studies',
    });
  }
});

// Public: Get single case study by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const caseStudy = await getOne(`
      SELECT id, slug, title, subtitle, excerpt, content, featured_image,
             client_name, industry, duration, results,
             published_at, updated_at, status, meta_title, meta_description
      FROM case_studies 
      WHERE slug = ? AND status = 'published'
    `, [slug]);

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found',
      });
    }

    res.json({
      success: true,
      data: {
        ...caseStudy,
        results: caseStudy.results ? JSON.parse(caseStudy.results) : [],
      },
    });
  } catch (error) {
    console.error('Get case study error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case study',
    });
  }
});

// Protected: Get all case studies (including drafts)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const caseStudies = await getAll(`
      SELECT cs.*, u.name as creator_name
      FROM case_studies cs
      LEFT JOIN users u ON cs.created_by = u.id
      ORDER BY cs.created_at DESC
    `);

    res.json({
      success: true,
      data: {
        caseStudies: caseStudies.map(cs => ({
          ...cs,
          results: cs.results ? JSON.parse(cs.results) : [],
        })),
      },
    });
  } catch (error) {
    console.error('Get all case studies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case studies',
    });
  }
});

// Protected: Create case study
router.post('/', authenticateToken, caseStudyValidation, async (req, res) => {
  try {
    const {
      title,
      subtitle,
      excerpt,
      content,
      featuredImage,
      clientName,
      industry,
      duration,
      results = [],
      status = 'draft',
      metaTitle,
      metaDescription,
    } = req.body;

    const slug = await generateUniqueSlug(title);
    const caseStudyId = uuidv4();
    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    await runQuery(`
      INSERT INTO case_studies (
        id, slug, title, subtitle, excerpt, content, featured_image,
        client_name, industry, duration, results,
        published_at, status, meta_title, meta_description, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      caseStudyId,
      slug,
      title,
      subtitle,
      excerpt,
      content,
      featuredImage || null,
      clientName,
      industry,
      duration,
      JSON.stringify(results),
      publishedAt,
      status,
      metaTitle || title,
      metaDescription || excerpt,
      req.user.id,
    ]);

    res.status(201).json({
      success: true,
      message: 'Case study created successfully',
      data: {
        id: caseStudyId,
        slug,
        title,
        status,
      },
    });
  } catch (error) {
    console.error('Create case study error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create case study',
    });
  }
});

// Protected: Update case study
router.put('/:id', authenticateToken, caseStudyValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      excerpt,
      content,
      featuredImage,
      clientName,
      industry,
      duration,
      results = [],
      status,
      metaTitle,
      metaDescription,
    } = req.body;

    const existingCaseStudy = await getOne('SELECT * FROM case_studies WHERE id = ?', [id]);
    if (!existingCaseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found',
      });
    }

    const slug = title !== existingCaseStudy.title 
      ? await generateUniqueSlug(title, id)
      : existingCaseStudy.slug;

    const publishedAt = status === 'published' && existingCaseStudy.status === 'draft'
      ? new Date().toISOString()
      : existingCaseStudy.published_at;

    await runQuery(`
      UPDATE case_studies SET
        slug = ?,
        title = ?,
        subtitle = ?,
        excerpt = ?,
        content = ?,
        featured_image = ?,
        client_name = ?,
        industry = ?,
        duration = ?,
        results = ?,
        published_at = ?,
        status = ?,
        meta_title = ?,
        meta_description = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      slug,
      title,
      subtitle,
      excerpt,
      content,
      featuredImage || existingCaseStudy.featured_image,
      clientName,
      industry,
      duration,
      JSON.stringify(results),
      publishedAt,
      status,
      metaTitle || title,
      metaDescription || excerpt,
      id,
    ]);

    res.json({
      success: true,
      message: 'Case study updated successfully',
      data: {
        id,
        slug,
        title,
        status,
      },
    });
  } catch (error) {
    console.error('Update case study error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update case study',
    });
  }
});

// Protected: Delete case study
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const existingCaseStudy = await getOne('SELECT * FROM case_studies WHERE id = ?', [id]);
    if (!existingCaseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found',
      });
    }

    await runQuery('DELETE FROM case_studies WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Case study deleted successfully',
    });
  } catch (error) {
    console.error('Delete case study error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete case study',
    });
  }
});

module.exports = router;
