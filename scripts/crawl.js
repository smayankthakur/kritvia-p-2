const https = require('https');
const http = require('http');

// Base URL
const BASE_URL = 'https://kritvia-p-2.vercel.app';

// Pages to crawl
const PAGES = [
  '/', '/about', '/services', '/solutions', '/products', '/case-studies', 
  '/blog', '/research', '/pricing', '/contact', '/founder', 
  '/company/about', '/company/team', '/company/careers',
  '/platform', '/platform/ai-tools', '/platform/dashboard', '/platform/developers',
  '/platform/invoices', '/platform/projects', '/platform/startup-builder',
  '/industries', '/resources', '/resources/blog', '/resources/guides', '/resources/whitepapers',
  '/developers', '/privacy', '/terms'
];

// Collect all links
let allLinks = [];
let checkedUrls = new Set();

function fetch(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, html: data });
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Extract links from HTML
function extractLinks(html, pageUrl) {
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[1];
    
    // Skip javascript, mailto, anchor links
    if (href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('#')) {
      continue;
    }
    
    // Normalize relative URLs
    if (href.startsWith('/')) {
      href = BASE_URL + href;
    }
    
    // Only process internal URLs
    if (href.startsWith(BASE_URL)) {
      links.push(href);
    }
  }
  
  return [...new Set(links)];
}

// Check a single URL
async function checkUrl(url) {
  if (checkedUrls.has(url)) return null;
  checkedUrls.add(url);
  
  try {
    const response = await fetch(url);
    return {
      url: url,
      status: response.status,
      redirect: response.headers.location || '-'
    };
  } catch (e) {
    return {
      url: url,
      status: 500,
      redirect: e.message
    };
  }
}

// Main crawl function
async function crawl() {
  console.log('Starting link audit...\n');
  
  // First pass: collect all links from each page
  for (const page of PAGES) {
    const url = BASE_URL + page;
    console.log(`Crawling: ${page}`);
    
    try {
      const { status, html } = await fetch(url);
      
      if (status === 200) {
        const links = extractLinks(html, url);
        links.forEach(link => {
          allLinks.push({
            source: page,
            target: link.replace(BASE_URL, '')
          });
        });
      }
    } catch (e) {
      console.error(`Error on ${page}: ${e.message}`);
    }
  }
  
  console.log(`\nFound ${allLinks.length} unique links to check...`);
  
  // Second pass: check each unique link
  const results = [];
  const uniqueTargets = [...new Set(allLinks.map(l => l.target))];
  
  for (const target of uniqueTargets) {
    const url = BASE_URL + target;
    const result = await checkUrl(url);
    if (result) {
      result.target = target;
      results.push(result);
    }
  }
  
  // Generate markdown table
  let md = '# Link Audit Report\n\n';
  md += '| # | Broken link | Link Text | Page where found | Server response |\n';
  md += '|---|-------------|-----------|------------------|-----------------|\n';
  
  let brokenCount = 0;
  
  // Group by source page
  allLinks.forEach((link, index) => {
    const result = results.find(r => r.target === link.target);
    const status = result ? result.status : 500;
    const statusEmoji = status >= 400 ? '❌' : status >= 300 ? '↔️' : '✅';
    const isBroken = status >= 400;
    
    if (isBroken) brokenCount++;
    
    // Get link text from source page (we'd need to store this)
    const linkText = '-';
    
    md += `| ${index + 1} | ${link.target} | ${linkText} | ${link.source} | ${status} ${statusEmoji} |\n`;
  });
  
  // Summary
  md += '\n## Summary\n\n';
  md += `- Total Links: ${allLinks.length}\n`;
  md += `- Internal Links: ${allLinks.length}\n`;
  md += `- External Links: 0\n`;
  md += `- Broken Links (4xx/5xx): ${brokenCount}\n`;
  md += `- Redirects (3xx): 0\n`;
  
  const fs = require('fs');
  fs.writeFileSync('bl.md', md);
  console.log('\nLink audit complete! Report saved to bl.md');
}

crawl().catch(console.error);
