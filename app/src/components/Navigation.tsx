import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Services', href: '/#services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'About', href: '/#about' },
  { label: 'Insights', href: '/blogs' },
  { label: 'Contact', href: '/#contact' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (!isHomePage && href.startsWith('/#')) {
      // Navigate to home page with hash
      return;
    }
    
    if (href.startsWith('/#')) {
      const element = document.querySelector(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="font-display text-xl lg:text-2xl font-bold text-[#111214] hover:text-[#2F8E92] transition-colors"
            >
              QuadAgile
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith('/#')) {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }
                  }}
                  className="text-sm font-medium text-[#6D737C] hover:text-[#111214] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Button
                onClick={() => scrollToSection('/#contact')}
                className="bg-[#2F8E92] hover:bg-[#267a7d] text-white rounded-xl px-6"
              >
                Book a call
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#111214]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={(e) => {
                if (item.href.startsWith('/#')) {
                  e.preventDefault();
                  scrollToSection(item.href);
                } else {
                  setIsMobileMenuOpen(false);
                }
              }}
              className="text-2xl font-display font-semibold text-[#111214] hover:text-[#2F8E92] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Button
            onClick={() => scrollToSection('/#contact')}
            className="mt-4 bg-[#2F8E92] hover:bg-[#267a7d] text-white rounded-xl px-8 py-6 text-lg"
          >
            Book a call
          </Button>
        </div>
      </div>
    </>
  );
}
