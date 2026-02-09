import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, accept any email/password
    // In production, this would validate against the backend
    if (formData.email && formData.password) {
      // Store auth token (in real app, this comes from backend)
      localStorage.setItem('adminToken', 'demo-token');
      localStorage.setItem('adminUser', JSON.stringify({
        id: '1',
        email: formData.email,
        name: 'Admin User',
        role: 'admin',
      }));
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Please enter both email and password');
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <SEO
        title="Admin Login | QuadAgile"
        description="Admin login for QuadAgile CMS"
        noindex
      />

      <div className="min-h-screen bg-[#0B0D10] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-white">QuadAgile</h1>
            <p className="mt-2 text-[#9CA3AF]">Admin Portal</p>
          </div>

          {/* Login Form */}
          <div className="bg-[#14161B] rounded-[28px] p-8 border border-white/5">
            <h2 className="font-display text-xl font-semibold text-white mb-6">
              Sign in to your account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6D737C]" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@quadagile.in"
                    required
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-[#6D737C] rounded-xl focus:border-[#2F8E92] focus:ring-[#2F8E92]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6D737C]" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-[#6D737C] rounded-xl focus:border-[#2F8E92] focus:ring-[#2F8E92]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D737C] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2F8E92] hover:bg-[#267a7d] text-white rounded-xl py-6 text-base font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a href="/#contact" className="text-sm text-[#6D737C] hover:text-[#2F8E92] transition-colors">
                Need help? Contact support
              </a>
            </div>
          </div>

          {/* Back to Site */}
          <div className="text-center mt-8">
            <a
              href="/"
              className="text-sm text-[#6D737C] hover:text-white transition-colors"
            >
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
