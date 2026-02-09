import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found | QuadAgile"
        description="The page you are looking for does not exist."
        noindex
      />

      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* 404 */}
          <div className="mb-8">
            <span className="font-accent text-8xl lg:text-9xl font-bold text-[#2F8E92]">
              404
            </span>
          </div>

          <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#111214] mb-4">
            Page not found
          </h1>
          <p className="text-[#6D737C] mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button className="bg-[#2F8E92] hover:bg-[#267a7d] text-white rounded-xl px-6 py-6">
                <Home className="w-4 h-4 mr-2" />
                Back to home
              </Button>
            </Link>
            <button onClick={() => window.history.back()}>
              <Button variant="outline" className="border-[#111214]/20 text-[#111214] hover:bg-white rounded-xl px-6 py-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go back
              </Button>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
