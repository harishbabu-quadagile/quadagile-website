import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Fractional CHRO', href: '/#services' },
    { label: 'Talent Acquisition', href: '/#services' },
    { label: 'Employee Experience', href: '/#services' },
    { label: 'HR Systems', href: '/#services' },
  ],
  company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blogs' },
    { label: 'Contact', href: '/#contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: 'https://in.linkedin.com/company/quadagile-consulting-llp', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com/Quadagile', label: 'Twitter' },
  { icon: Youtube, href: 'https://www.youtube.com/@Quadagile', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-[#0B0D10] text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-display text-2xl font-bold text-white">
              QuadAgile
            </Link>
            <p className="mt-4 text-[#9CA3AF] text-sm leading-relaxed max-w-xs">
              People-first HR consulting for modern teams. We help startups and growing companies build agile people practices.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2F8E92] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#9CA3AF] hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#9CA3AF] hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#2F8E92] mt-0.5 flex-shrink-0" />
                <span className="text-[#9CA3AF] text-sm">
                  GoSpaze, 1st Floor, PR Business Center,<br />
                  Kadubeesanahalli, Bengaluru,<br />
                  Karnataka 560103
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#2F8E92] flex-shrink-0" />
                <a href="tel:+917406109111" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">
                  +91 74061 09111
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#2F8E92] flex-shrink-0" />
                <a href="mailto:reach-us@quadagile.in" className="text-[#9CA3AF] hover:text-white transition-colors text-sm">
                  reach-us@quadagile.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#6B7280] text-sm">
            © {new Date().getFullYear()} QuadAgile. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-[#6B7280] hover:text-white transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
