import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="h-8 w-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              K
            </span>
            <span className="text-xl font-bold text-white">Kritvia</span>
          </div>
          <p className="text-gray-400 max-w-xl">
            The AI Operating System that replaces your CRM, marketing tools, and operations — with one intelligent system.
          </p>
          <div className="flex space-x-4 text-gray-400 hover:text-white transition-colors">
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Security
            </a>
          </div>
        </div>
        <div className="space-x-8 lg:space-x-0 lg:border-l border-white/10 lg:pl-8 lg:py-0 py-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-white mb-2">Product</h3>
            <nav className="space-y-1">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                Security
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                Integrations
              </Link>
            </nav>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-white mb-2">Company</h3>
            <nav className="space-y-1">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-white mb-2">Resources</h3>
            <nav className="space-y-1">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                Status
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
        <p className="text-sm">
          © {new Date().getFullYear()} Kritvia. All rights reserved.
        </p>
      </div>
    </footer>
  );
}