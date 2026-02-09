import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Linkedin, Twitter, Youtube, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  useEffect(() => {
    const section = sectionRef.current;
    const formCard = formCardRef.current;
    const infoCard = infoCardRef.current;

    if (!section || !formCard || !infoCard) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(formCard,
        { x: '-8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(infoCard,
        { x: '8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', company: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#0B0D10] py-20 lg:py-28 z-[140]"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-[1320px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
              Let's build a people practice that scales.
            </h2>
            <p className="mt-4 text-lg text-[#9CA3AF]">
              Tell us what you're solving. We'll reply within 24 hours.
            </p>
          </div>

          {/* Cards */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Form Card */}
            <div
              ref={formCardRef}
              className="flex-1 lg:w-[55%] bg-white rounded-[28px] p-6 lg:p-10"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#111214]">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="rounded-xl border-[#111214]/10 focus:border-[#2F8E92] focus:ring-[#2F8E92]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#111214]">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      required
                      className="rounded-xl border-[#111214]/10 focus:border-[#2F8E92] focus:ring-[#2F8E92]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-[#111214]">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    className="rounded-xl border-[#111214]/10 focus:border-[#2F8E92] focus:ring-[#2F8E92]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[#111214]">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your people challenges..."
                    required
                    rows={5}
                    className="rounded-xl border-[#111214]/10 focus:border-[#2F8E92] focus:ring-[#2F8E92] resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#2F8E92] hover:bg-[#267a7d] text-white rounded-xl px-8 py-6 text-base font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send message
                      </>
                    )}
                  </Button>
                  <a
                    href="mailto:reach-us@quadagile.in"
                    className="text-sm text-[#6D737C] hover:text-[#2F8E92] transition-colors"
                  >
                    Prefer email? reach-us@quadagile.in
                  </a>
                </div>
              </form>
            </div>

            {/* Info Card */}
            <div
              ref={infoCardRef}
              className="flex-1 lg:w-[37%] bg-[#14161B] rounded-[28px] p-6 lg:p-10"
            >
              <h3 className="font-display text-xl font-semibold text-white mb-8">
                Get in touch
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#2F8E92]" />
                  </div>
                  <div>
                    <p className="text-white text-sm leading-relaxed">
                      GoSpaze, 1st Floor, PR Business Center,<br />
                      Sy Nos. 36/2 and 37/1,<br />
                      Marathahalli – Sarjapur Outer Ring Rd,<br />
                      Kadubeesanahalli, Bengaluru,<br />
                      Karnataka 560103
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#2F8E92]" />
                  </div>
                  <a href="tel:+917406109111" className="text-white text-sm hover:text-[#2F8E92] transition-colors">
                    +91 74061 09111
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#2F8E92]" />
                  </div>
                  <a href="mailto:reach-us@quadagile.in" className="text-white text-sm hover:text-[#2F8E92] transition-colors">
                    reach-us@quadagile.in
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-[#6B7280] text-sm mb-4">Follow us</p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://in.linkedin.com/company/quadagile-consulting-llp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2F8E92] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="https://twitter.com/Quadagile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2F8E92] transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="https://www.youtube.com/@Quadagile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2F8E92] transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
