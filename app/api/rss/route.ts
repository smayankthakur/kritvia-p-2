import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/sanity/queries'

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const posts = await getAllPosts()
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kritvia.com'
    
    // Helper function to extract plain text from Portable Text
    const extractText = (blocks: any[]): string => {
      return blocks
        .filter(block => block._type === 'block')
        .map(block => 
          block.children
            .filter((child: any) => child._type === 'span')
            .map((child: any) => child.text)
            .join('')
        )
        .join(' ')
    }

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Kritvia Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Latest insights and news from Kritvia</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    ${posts.map((post: any) => `
      <item>
        <title>${post.title}</title>
        <link>${baseUrl}/blog/${post.slug.current}</link>
        <guid>${baseUrl}/blog/${post.slug.current}</guid>
        <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
        <description>${post.excerpt}</description>
        <content:encoded><![CDATA[${extractText(post.content || [])}]]></content:encoded>
      </item>
    `).join('')}
  </channel>
</rss>`.trim()
    
    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}