import Link from 'next/link';

export function FooterBrand() {
  return (
    <div className="col-span-1">
      <Link href="/" className="inline-flex items-center gap-2 mb-4">
        <span className="text-2xl font-bold text-white">Kritvia</span>
      </Link>
      <p className="text-sm font-semibold text-white mb-2">
        Engineering Intelligence Into Digital Infrastructure
      </p>
      <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
        Kritvia builds AI-powered digital platforms, automation systems, 
        and enterprise infrastructure for global companies.
      </p>
    </div>
  );
}
