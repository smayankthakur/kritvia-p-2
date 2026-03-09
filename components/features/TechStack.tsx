import { cn } from '@/lib/utils/cn';

interface Tech {
  name: string;
  icon: string;
  category: string;
}

const TECHNOLOGIES: Tech[] = [
  // AI/ML
  { name: 'OpenAI GPT-4', icon: '🤖', category: 'AI/ML' },
  { name: 'LangChain', icon: '🔗', category: 'AI/ML' },
  { name: 'PyTorch', icon: '🔥', category: 'AI/ML' },
  { name: 'TensorFlow', icon: '📊', category: 'AI/ML' },
  { name: 'Hugging Face', icon: '🤗', category: 'AI/ML' },
  // Frontend
  { name: 'Next.js', icon: '▲', category: 'Frontend' },
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'TypeScript', icon: '📘', category: 'Frontend' },
  { name: 'Tailwind CSS', icon: '🎨', category: 'Frontend' },
  // Backend
  { name: 'Node.js', icon: '🟢', category: 'Backend' },
  { name: 'Python', icon: '🐍', category: 'Backend' },
  { name: 'FastAPI', icon: '⚡', category: 'Backend' },
  { name: 'GraphQL', icon: '◈', category: 'Backend' },
  // Cloud
  { name: 'AWS', icon: '☁️', category: 'Cloud' },
  { name: 'GCP', icon: '🌐', category: 'Cloud' },
  { name: 'Azure', icon: '🔷', category: 'Cloud' },
  { name: 'Vercel', icon: '▲', category: 'Cloud' },
  // Database
  { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { name: 'MongoDB', icon: '🍃', category: 'Database' },
  { name: 'Redis', icon: '⚡', category: 'Database' },
  { name: 'Pinecone', icon: '📌', category: 'Database' },
];

const CATEGORIES = ['All', 'AI/ML', 'Frontend', 'Backend', 'Cloud', 'Database'];

interface TechCardProps {
  tech: Tech;
}

function TechCard({ tech }: TechCardProps) {
  return (
    <div className={cn(
      'group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200',
      'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-primary-700/50',
      'hover:shadow-lg hover:shadow-primary-900/20 hover:-translate-y-0.5',
    )}>
      <span className="text-2xl">{tech.icon}</span>
      <span className="text-xs text-neutral-400 group-hover:text-neutral-200 transition-colors text-center font-medium">
        {tech.name}
      </span>
    </div>
  );
}

interface Props {
  technologies?: Tech[];
  showCategories?: boolean;
  title?: string;
  subtitle?: string;
}

export function TechStack({
  technologies = TECHNOLOGIES,
  showCategories = false,
  title = 'Technologies We Use',
  subtitle = 'We work with the latest, battle-tested technologies to build scalable, maintainable solutions.',
}: Props) {
  return (
    <div>
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {title && <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">{title}</h2>}
          {subtitle && <p className="text-neutral-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}

      {showCategories && (
        <div className="space-y-8">
          {CATEGORIES.filter((c) => c !== 'All').map((category) => {
            const techs = technologies.filter((t) => t.category === category);
            if (techs.length === 0) return null;
            return (
              <div key={category}>
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {techs.map((tech) => (
                    <TechCard key={tech.name} tech={tech} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!showCategories && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3">
          {technologies.map((tech) => (
            <TechCard key={tech.name} tech={tech} />
          ))}
        </div>
      )}
    </div>
  );
}
