const cheerio = require('cheerio');
const fs = require('fs');

// Base URL to crawl
const BASE_URL = 'https://kritvia-p-2.vercel.app';

// List of pages to crawl (static routes from routes.ts)
const pagesToCrawl = [
  '/',
  '/about',
  '/services',
  '/solutions',
  '/products',
  '/case-studies',
  '/blog',
  '/research',
  '/pricing',
  '/contact',
  '/founder',
  '/company/about',
  '/company/team',
  '/company/careers',
  '/platform',
  '/platform/ai-tools',
  '/platform/dashboard',
  '/platform/developers',
  '/platform/invoices',
  '/platform/projects',
  '/platform/startup-builder',
  '/industries',
  '/resources',
  '/resources/blog',
  '/resources/guides',
  '/resources/whitepapers',
  '/developers',
  '/privacy',
  '/terms',
];

// Simple fetch function using built-in https
const https = require('https');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : https;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          redirect: res.headers.location || null,
          html: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Extract links from HTML
function extractLinks(html, baseUrl) {
  const $ = cheerio.load(html);
  const links = [];
  
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    
    if (href) {
      // Normalize the URL
      let normalizedHref = href;
      
      // Skip javascript and mailto links
      if (href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('#')) {
        return;
      }
      
      // Handle relative URLs
      if (href.startsWith('/')) {
        normalizedHref = href;
      } else if (href.startsWith('http')) {
        // External URL
      }
      
      links.push({
        href: normalizedHref,
        text: text.substring(0, 50) // Limit text length
      });
    }
  });
  
  return links;
}

// Main crawling function
async function crawlSite() {
  const results = [];
  const visited = new Set();
  
  console.log('Starting link audit...\n');
  
  for (const path of pagesToCrawl) {
    const url = BASE_URL + path;
    
    if (visited.has(url)) continue;
    visited.add(url);
    
    try {
      console.log(`Crawling: ${path}`);
      const { status, redirect, html } = await fetchPage(url);
      
      // Extract links from the page
      const links = extractLinks(html, BASE_URL);
      
      // Process each link
      for (const link of links) {
        const isInternal = !link.href.startsWith('http');
        const targetUrl = isInternal ? link.href : link.href;
        
        results.push({
          sourcePage: path,
          anchorText: link.text,
          targetUrl: targetUrl,
          linkType: isInternal ? 'Internal' : 'External',
          statusCode: status,
          redirect: redirect || '-'
        });
      }
      
    } catch (err) {
      console.error(`Error crawling ${path}:`, err.message);
      results.push({
        sourcePage: path,
        anchorText: '-',
        targetUrl: path,
        linkType: 'Internal',
        statusCode: 500,
        redirect: '-',
        error: err.message
      });
    }
  }
  
  return results;
}

// Generate markdown report
function generateReport(results) {
  let md = '# Link Audit Report\n\n';
  md += '| Source Page | Anchor Text | Target URL | Link Type | Status Code | Redirect |\n';
  md += '| ----------- | ----------- | ---------- | --------- | ----------- | -------- |\n';
  
  // Group by source page
  const grouped = {};
  results.forEach(r => {
    if (!grouped[r.sourcePage]) grouped[r.sourcePage] = [];
    grouped[r.sourcePage].push(r);
  });
  
  for (const [page, links] of Object.entries(grouped)) {
    links.forEach(link => {
      const statusEmoji = link.statusCode >= 400 ? '❌' : link.statusCode >= 300 ? '↔️' : '✅';
      md += `| ${link.sourcePage} | ${link.anchorText.substring(0, 30)} | ${link.targetUrl} | ${link.linkType} | ${link.statusCode} ${statusEmoji} | ${link.redirect} |\n`;
    });
  }
  
  // Summary
  const totalLinks = results.length;
  const brokenLinks = results.filter(r => r.statusCode >= 400).length;
  const redirects = results.filter(r => r.redirect !== '-').length;
  const internalLinks = results.filter(r => r.linkType === 'Internal').length;
  const externalLinks = results.filter(r => r.linkType === 'External').length;
  
  md += '\n## Summary\n\n';
  md += `- Total Links: ${totalLinks}\n`;
  md += `- Internal Links: ${internalLinks}\n`;
  md += `- External Links: ${externalLinks}\n`;
  md += `- Broken Links (4xx/5xx): ${brokenLinks}\n`;
  md += `- Redirects (3xx): ${redirects}\n`;
  
  return md;
}

// Run the crawler
crawlSite().then(results => {
  const report = generateReport(results);
  fs.writeFileSync('bl.md', report);
  console.log('\nLink audit complete! Report saved to bl.md');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
