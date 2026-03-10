import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import rehype from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';

const docsDirectory = path.join(process.cwd(), 'content/docs');

export interface DocMeta {
  slug: string[];
  title: string;
  description: string;
  order: number;
  category: string;
  version?: string;
}

export interface Doc {
  meta: DocMeta;
  content: string;
  html: string;
}

export interface NavItem {
  title: string;
  slug: string;
  order: number;
  children?: NavItem[];
}

export interface NavCategory {
  title: string;
  order: number;
  items: NavItem[];
}

// Get all available doc versions
export function getDocVersions(): string[] {
  if (!fs.existsSync(docsDirectory)) {
    return ['v1'];
  }
  const entries = fs.readdirSync(docsDirectory, { withFileTypes: true });
  const versions = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
  return versions.length > 0 ? versions : ['v1'];
}

// Get all docs for a specific version
export function getAllDocs(version: string = 'v1'): DocMeta[] {
  const versionDir = path.join(docsDirectory, version);
  
  if (!fs.existsSync(versionDir)) {
    return [];
  }

  const docs: DocMeta[] = [];
  
  function scanDirectory(dir: string, category: string = '') {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        const categoryName = file.name.charAt(0).toUpperCase() + file.name.slice(1);
        scanDirectory(fullPath, categoryName);
      } else if (file.name.endsWith('.mdx') || file.name.endsWith('.md')) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        
        const relativePath = path.relative(versionDir, fullPath);
        const slug = relativePath
          .replace(/\.mdx?$/, '')
          .replace(/\\/g, '/')
          .split('/');
        
        if (slug[slug.length - 1] === 'index') {
          slug.pop();
        }
        
        docs.push({
          slug,
          title: data.title || slug[slug.length - 1].charAt(0).toUpperCase() + slug[slug.length - 1].slice(1),
          description: data.description || '',
          order: data.order || 999,
          category: data.category || category || 'General',
          version
        });
      }
    }
  }
  
  scanDirectory(versionDir);
  return docs.sort((a, b) => a.order - b.order);
}

// Get doc by slug
export async function getDocBySlug(slug: string[], version: string = 'v1'): Promise<Doc | null> {
  const versionDir = path.join(docsDirectory, version);
  const realSlug = slug.length === 0 ? ['index'] : slug;
  const fullPath = path.join(versionDir, ...realSlug) + '.mdx';
  const fullPathMd = path.join(versionDir, ...realSlug) + '.md';
  const fullPathIndex = path.join(versionDir, ...realSlug, 'index.mdx');
  const fullPathIndexMd = path.join(versionDir, ...realSlug, 'index.md');
  
  let fileContents = '';
  let filePath = '';
  
  if (fs.existsSync(fullPath)) {
    fileContents = fs.readFileSync(fullPath, 'utf8');
    filePath = fullPath;
  } else if (fs.existsSync(fullPathMd)) {
    fileContents = fs.readFileSync(fullPathMd, 'utf8');
    filePath = fullPathMd;
  } else if (fs.existsSync(fullPathIndex)) {
    fileContents = fs.readFileSync(fullPathIndex, 'utf8');
    filePath = fullPathIndex;
  } else if (fs.existsSync(fullPathIndexMd)) {
    fileContents = fs.readFileSync(fullPathIndexMd, 'utf8');
    filePath = fullPathIndexMd;
  } else {
    return null;
  }
  
  const { data, content } = matter(fileContents);
  
  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehype)
    .process(content);
  
  const htmlContent = processedContent.toString();
  
  return {
    meta: {
      slug,
      title: data.title || slug[slug.length - 1].charAt(0).toUpperCase() + slug[slug.length - 1].slice(1),
      description: data.description || '',
      order: data.order || 999,
      category: data.category || 'General',
      version
    },
    content,
    html: htmlContent
  };
}

// Generate static params for all docs
export function getAllDocPaths(version: string = 'v1'): { slug: string[] }[] {
  const docs = getAllDocs(version);
  return docs.map(doc => ({ slug: doc.slug }));
}

// Build navigation tree
export function buildNavigation(version: string = 'v1'): NavCategory[] {
  const docs = getAllDocs(version);
  const categories: Map<string, NavCategory> = new Map();
  
  for (const doc of docs) {
    const categoryName = doc.category || 'General';
    
    if (!categories.has(categoryName)) {
      categories.set(categoryName, {
        title: categoryName,
        order: getCategoryOrder(categoryName),
        items: []
      });
    }
    
    const category = categories.get(categoryName)!;
    category.items.push({
      title: doc.title,
      slug: doc.slug.join('/'),
      order: doc.order
    });
  }
  
  // Sort items within each category
  for (const category of categories.values()) {
    category.items.sort((a, b) => a.order - b.order);
  }
  
  return Array.from(categories.values()).sort((a, b) => a.order - b.order);
}

function getCategoryOrder(category: string): number {
  const orderMap: Record<string, number> = {
    'Introduction': 1,
    'Getting Started': 2,
    'SDK': 3,
    'API': 4,
    'Guides': 5,
    'Tutorials': 6,
    'Reference': 7,
    'General': 99
  };
  return orderMap[category] || 50;
}

// Extract headings from HTML for TOC
export function extractHeadings(html: string): { id: string; text: string; level: number }[] {
  const headingRegex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[2-3]>/g;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;
  
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3]
    });
  }
  
  return headings;
}

// Build search index
export interface SearchIndex {
  docs: Array<{
    title: string;
    description: string;
    slug: string;
    content: string;
  }>;
}

export function buildSearchIndex(version: string = 'v1'): SearchIndex {
  const docs = getAllDocs(version);
  const searchDocs: SearchIndex['docs'] = [];
  
  for (const doc of docs) {
    const fullPath = path.join(docsDirectory, version, ...doc.slug) + '.mdx';
    const fullPathMd = path.join(docsDirectory, version, ...doc.slug) + '.md';
    
    let content = '';
    if (fs.existsSync(fullPath)) {
      content = fs.readFileSync(fullPath, 'utf8');
    } else if (fs.existsSync(fullPathMd)) {
      content = fs.readFileSync(fullPathMd, 'utf8');
    }
    
    // Strip markdown syntax for better search
    const plainContent = content
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`[^`]+`/g, '') // Remove inline code
      .replace(/#+\s/g, '') // Remove headings
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/[*_~]/g, '') // Remove formatting
      .replace(/\n+/g, ' ') // Remove newlines
      .trim();
    
    searchDocs.push({
      title: doc.title,
      description: doc.description,
      slug: doc.slug.join('/'),
      content: plainContent
    });
  }
  
  return { docs: searchDocs };
}
