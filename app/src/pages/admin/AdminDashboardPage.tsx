import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Briefcase, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  Search
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { blogs as allBlogs } from '@/data/blogs';
import { caseStudies as allCaseStudies } from '@/data/caseStudies';
import type { Blog, CaseStudy } from '@/types';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'blogs' | 'case-studies'>('blogs');
  const [blogs, setBlogs] = useState<Blog[]>(allBlogs);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(allCaseStudies);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      setBlogs(blogs.filter(b => b.id !== id));
      toast.success('Blog deleted successfully');
    }
  };

  const handleDeleteCaseStudy = (id: string) => {
    if (confirm('Are you sure you want to delete this case study?')) {
      setCaseStudies(caseStudies.filter(cs => cs.id !== id));
      toast.success('Case study deleted successfully');
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCaseStudies = caseStudies.filter(cs =>
    cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cs.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <SEO
        title="Admin Dashboard | QuadAgile"
        description="QuadAgile CMS Dashboard"
        noindex
      />

      <div className="min-h-screen bg-[#0B0D10]">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#14161B] border-r border-white/5 hidden lg:block">
          <div className="p-6">
            <h1 className="font-display text-xl font-bold text-white">QuadAgile</h1>
            <p className="text-xs text-[#6D737C]">Admin Dashboard</p>
          </div>

          <nav className="px-4 py-4">
            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'blogs'
                  ? 'bg-[#2F8E92] text-white'
                  : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              Blogs
            </button>
            <button
              onClick={() => setActiveTab('case-studies')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mt-2 ${
                activeTab === 'case-studies'
                  ? 'bg-[#2F8E92] text-white'
                  : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Case Studies
            </button>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#9CA3AF] hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden bg-[#14161B] border-b border-white/5 p-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-lg font-bold text-white">QuadAgile Admin</h1>
            <button
              onClick={handleLogout}
              className="text-[#9CA3AF] hover:text-white"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('blogs')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'blogs'
                  ? 'bg-[#2F8E92] text-white'
                  : 'bg-white/5 text-[#9CA3AF]'
              }`}
            >
              Blogs
            </button>
            <button
              onClick={() => setActiveTab('case-studies')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'case-studies'
                  ? 'bg-[#2F8E92] text-white'
                  : 'bg-white/5 text-[#9CA3AF]'
              }`}
            >
              Case Studies
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="lg:ml-64 p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                {activeTab === 'blogs' ? 'Blog Posts' : 'Case Studies'}
              </h2>
              <p className="text-[#6D737C] text-sm mt-1">
                Manage your {activeTab === 'blogs' ? 'blog content' : 'case studies'}
              </p>
            </div>
            <Button className="bg-[#2F8E92] hover:bg-[#267a7d] text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6D737C]" />
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-[#14161B] border-white/10 text-white placeholder:text-[#6D737C] rounded-xl h-12"
            />
          </div>

          {/* Content Table */}
          <div className="bg-[#14161B] rounded-[28px] border border-white/5 overflow-hidden">
            {activeTab === 'blogs' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-4 text-sm font-medium text-[#9CA3AF]">Title</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-[#9CA3AF]">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-[#9CA3AF]">Date</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-[#9CA3AF]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map((blog) => (
                      <tr key={blog.id} className="border-b border-white/5 last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={blog.featuredImage}
                              alt={blog.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-white font-medium text-sm line-clamp-1">{blog.title}</p>
                              <p className="text-[#6D737C] text-xs">{blog.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            blog.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#9CA3AF] text-sm">
                          {formatDate(blog.publishedAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/blogs/${blog.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button className="p-2 rounded-lg bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="p-2 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-4 text-sm font-medium text-[#9CA3AF]">Title</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-[#9CA3AF]">Client</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-[#9CA3AF]">Status</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-[#9CA3AF]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCaseStudies.map((caseStudy) => (
                      <tr key={caseStudy.id} className="border-b border-white/5 last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={caseStudy.featuredImage}
                              alt={caseStudy.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-white font-medium text-sm line-clamp-1">{caseStudy.title}</p>
                              <p className="text-[#6D737C] text-xs">{caseStudy.industry}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#9CA3AF] text-sm">
                          {caseStudy.clientName}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            caseStudy.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {caseStudy.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/case-studies/${caseStudy.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button className="p-2 rounded-lg bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCaseStudy(caseStudy.id)}
                              className="p-2 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-[#14161B] rounded-[28px] p-6 border border-white/5">
              <p className="text-[#6D737C] text-sm">Total Posts</p>
              <p className="text-3xl font-display font-bold text-white mt-2">
                {activeTab === 'blogs' ? blogs.length : caseStudies.length}
              </p>
            </div>
            <div className="bg-[#14161B] rounded-[28px] p-6 border border-white/5">
              <p className="text-[#6D737C] text-sm">Published</p>
              <p className="text-3xl font-display font-bold text-green-400 mt-2">
                {activeTab === 'blogs' 
                  ? blogs.filter(b => b.status === 'published').length 
                  : caseStudies.filter(cs => cs.status === 'published').length}
              </p>
            </div>
            <div className="bg-[#14161B] rounded-[28px] p-6 border border-white/5">
              <p className="text-[#6D737C] text-sm">Drafts</p>
              <p className="text-3xl font-display font-bold text-yellow-400 mt-2">
                {activeTab === 'blogs' 
                  ? blogs.filter(b => b.status === 'draft').length 
                  : caseStudies.filter(cs => cs.status === 'draft').length}
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
