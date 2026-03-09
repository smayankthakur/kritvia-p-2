import Link from 'next/link';
import { FooterLink } from '@/lib/navigation/footerLinks';

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="col-span-1">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-neutral-400 hover:text-white transition-colors duration-200 relative group inline-block"
            >
              {link.label}
              <span className="absolute left-0 bottom-0 w-0 h-px bg-primary-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
