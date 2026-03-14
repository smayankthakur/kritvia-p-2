import { groq } from 'next-sanity'
import { fetch, fetchWithTag } from './live'

// Fetch all posts with essential fields
export async function getPosts() {
  return fetch(
    groq`*[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      status,
      publishedAt,
      updatedAt,
      excerpt,
      featuredImage{
        alt,
        asset->{
          _id,
          url
        }
      },
      author->{
        _id,
        name,
        slug,
        image{
          alt,
          asset->{
            _id,
            url
          }
        }
      },
      category->{
        _id,
        title,
        slug
      },
      seo{
        seoTitle,
        seoDescription,
        seoKeywords
      }
    }`
  )
}

// Export raw GROQ queries for direct client usage
export const getPostsQuery = groq`*[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  status,
  publishedAt,
  updatedAt,
  excerpt,
  featuredImage{
    alt,
    asset->{
      _id,
      url
    }
  },
  author->{
    _id,
    name,
    slug,
    image{
      alt,
      asset->{
        _id,
        url
      }
    }
  },
  category->{
    _id,
    title,
    slug
  },
  seo{
    seoTitle,
    seoDescription,
    seoKeywords
  }
}`

// Fetch all post slugs for generateStaticParams
export async function getAllPostSlugs() {
  return fetch(
    groq`*[_type == "post" && defined(slug.current)]{
      slug{
        current
      }
    }`
  )
}

// Fetch posts by category
export async function getPostsByCategory(categorySlug: string) {
  return fetch(
    groq`*[_type == "post" && defined(publishedAt) && category->slug.current == $categorySlug] | order(publishedAt desc) {
      _id,
      title,
      slug,
      status,
      publishedAt,
      updatedAt,
      excerpt,
      featuredImage{
        alt,
        asset->{
          _id,
          url
        }
      },
      author->{
        _id,
        name,
        slug,
        image{
          alt,
          asset->{
            _id,
            url
          }
        }
      },
      category->{
        _id,
        title,
        slug
      },
      seo{
        seoTitle,
        seoDescription,
        seoKeywords
      }
    }`,
    { categorySlug }
  )
}

// Fetch posts by tag
export async function getPostsByTag(tagSlug: string) {
  return fetch(
    groq`*[_type == "post" && defined(publishedAt) && tags[]->slug.current == $tagSlug] | order(publishedAt desc) {
      _id,
      title,
      slug,
      status,
      publishedAt,
      updatedAt,
      excerpt,
      featuredImage{
        alt,
        asset->{
          _id,
          url
        }
      },
      author->{
        _id,
        name,
        slug,
        image{
          alt,
          asset->{
            _id,
            url
          }
        }
      },
      category->{
        _id,
        title,
        slug
      },
      seo{
        seoTitle,
        seoDescription,
        seoKeywords
      }
    }`,
    { tagSlug }
  )
}

// Fetch all category slugs for generateStaticParams
export async function getAllCategorySlugs() {
  return fetch(
    groq`*[_type == "category" && defined(slug.current)]{
      slug{
        current
      }
    }`
  )
}

// Fetch all tag slugs for generateStaticParams
export async function getAllTagSlugs() {
  return fetch(
    groq`*[_type == "tag" && defined(slug.current)]{
      slug{
        current
      }
    }`
  )
}

// Fetch all documentation slugs for generateStaticParams
export async function getAllDocumentationSlugs() {
  return fetch(
    groq`*[_type == "documentation" && defined(slug.current)]{
      slug{
        current
      }
    }`
  )
}

// Search across posts, products, documentation, and pages
export async function searchAll(term: string) {
  const searchTerm = `*${term}*`;
  // We'll fetch from each type and then combine.
  // We'll use the fetch function from './live'
  const [posts, products, documentation, pages] = await Promise.all([
    fetch(
      groq`*[_type == "post" && (title match $searchTerm || excerpt match $searchTerm) && defined(publishedAt)] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        publishedAt,
        featuredImage{
          alt,
          asset->{
            _id,
            url
          }
        }
      }`,
      { searchTerm }
    ),
    fetch(
      groq`*[_type == "product" && (title match $searchTerm || description match $searchTerm) && status == "published"] {
        _id,
        _type,
        title,
        slug,
        tagline,
        price,
        priceUnit,
        featuredImage{
          alt,
          asset->{
            _id,
            url
          }
        }
      }`,
      { searchTerm }
    ),
    fetch(
      groq`*[_type == "documentation" && (title match $searchTerm)] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        publishedAt,
        featuredImage{
          alt,
          asset->{
            _id,
            url
          }
        }
      }`,
      { searchTerm }
    ),
    fetch(
      groq`*[_type == "page" && (title match $searchTerm || description match $searchTerm)] {
        _id,
        _type,
        title,
        slug,
        subtitle,
        description,
        heroImage{
          alt,
          asset->{
            _id,
            url
          }
        }
      }`,
      { searchTerm }
    )
  ]);

  return { posts, products, documentation, pages };
}

// Fetch a single post by slug with essential fields
export async function getPostBySlug(slug: string) {
  return fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      status,
      publishedAt,
      updatedAt,
      excerpt,
      featuredImage{
        alt,
        asset->{
          _id,
          url
        }
      },
      author->{
        _id,
        name,
        slug,
        image{
          alt,
          asset->{
            _id,
            url
          }
        }
      },
      category->{
        _id,
        title,
        slug
      },
      seo{
        seoTitle,
        seoDescription,
        seoKeywords
      }
    }`,
    { slug }
  )
}

// Export raw GROQ queries for direct client usage
export const getPostBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  status,
  publishedAt,
  updatedAt,
  excerpt,
  featuredImage{
    alt,
    asset->{
      _id,
      url
    }
  },
  author->{
    _id,
    name,
    slug,
    image{
      alt,
      asset->{
        _id,
        url
      }
    }
  },
  category->{
    _id,
    title,
    slug
  },
  seo{
    seoTitle,
    seoDescription,
    seoKeywords
  }
}`

// Fetch all products with essential fields
export async function getProducts() {
  return fetch(
    groq`*[_type == "product" && status == "published"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      status,
      publishedAt,
      updatedAt,
      tagline,
      description,
      price,
      priceUnit,
      featured,
      featuredImage{
        alt,
        asset->{
          _id,
          url
        }
      },
      features,
      category->{
        _id,
        title,
        slug
      },
      seo{
        seoTitle,
        seoDescription,
        seoKeywords
      },
      icon,
      gradient
    }`
  )
}

// Fetch all product slugs for generateStaticParams
export async function getAllProductSlugs() {
  return fetch(
    groq`*[_type == "product" && defined(slug.current)]{
      slug{
        current
      }
    }`
  )
}

// Fetch a single product by slug with essential fields
export async function getProductBySlug(slug: string) {
  return fetch(
    groq`*[_type == "product" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      tagline,
      description,
      price,
      priceUnit,
      featured,
      image{
        alt,
        asset->{
          _id,
          url
        }
      },
      gallery[]{
        alt,
        asset->{
          _id,
          url
        }
      },
      features,
      body,
      category->{
        _id,
        title,
        slug
      }
    }`,
    { slug }
  )
}

// Fetch related posts (by category or tags, excluding current post)
export async function getRelatedPosts(postSlug: string, categorySlug: string, tags: string[], limit: number = 3) {
  // Build GROQ query to find posts with same category or tags, excluding current post
  // We'll prioritize same category, then same tags
  return fetch(
    groq`*[_type == "post" && defined(publishedAt) && slug.current != $postSlug && (category->slug.current == $categorySlug || tags[]->slug.current in $tags)] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage{
        alt,
        asset->{
          _id,
          url
        }
      },
      author->{
        _id,
        name,
        slug,
        image{
          alt,
          asset->{
            _id,
            url
          }
        }
      },
      category->{
        _id,
        title,
        slug
      }
    }`,
    { postSlug, categorySlug, tags, limit }
  )
}

// Fetch related products (by category, excluding current product)
export async function getRelatedProducts(productSlug: string, categorySlug: string, limit: number = 3) {
  return fetch(
    groq`*[_type == "product" && slug.current != $productSlug && category->slug.current == $categorySlug && published == true] | order(_createdAt desc) [0...$limit] {
      _id,
      title,
      slug,
      tagline,
      price,
      priceUnit,
      featuredImage{
        alt,
        asset->{
          _id,
          url
        }
      },
      category->{
        _id,
        title,
        slug
      }
    }`,
    { productSlug, categorySlug, limit }
  )
}

// Fetch related documentation (by category, excluding current documentation)
export async function getRelatedDocumentation(docSlug: string, categorySlug: string, limit: number = 3) {
  return fetch(
    groq`*[_type == "documentation" && slug.current != $docSlug && category->slug.current == $categorySlug] | order(_createdAt desc) [0...$limit] {
      _id,
      title,
      slug,
      category->{
        _id,
        title,
        slug
      }
    }`,
    { docSlug, categorySlug, limit }
  )
}

// Fetch all pages with essential fields
export async function getPages() {
  return fetch(
    groq`*[_type == "page"]{
      _id,
      title,
      slug,
      subtitle,
      description,
      heroImage{
        alt,
        asset->{
          _id,
          url
        }
      },
      seo{
        seoTitle,
        seoDescription,
        seoKeywords
      }
    }`
  )
}

// Fetch all page slugs for generateStaticParams
export async function getAllPageSlugs() {
  return fetch(
    groq`*[_type == "page" && defined(slug.current)]{
      slug{
        current
      }
    }`
  )
}

// Fetch a single page by slug with essential fields
export async function getPageBySlug(slug: string) {
  return fetch(
    groq`*[_type == "page" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      subtitle,
      description,
      heroImage{
        alt,
        asset->{
          _id,
          url
        }
      },
      sections,
      seo{
        seoTitle,
        seoDescription,
        seoKeywords
      }
    }`,
    { slug }
  )
}

// Fetch founder information
export async function getFounder() {
  return fetch(
    groq`*[_type == "founder"][0]{
      _id,
      name,
      title,
      tagline,
      bio,
      shortBio,
      mission,
      vision,
      website,
      socials,
      image{
        alt,
        asset->{
          _id,
          url
        }
      },
      companies[]{
        name,
        role,
        description
      },
      achievements[],
      authorityBadges[],
      quote
    }`
  )
}

// Export raw GROQ queries for direct client usage
export const getFounderQuery = groq`*[_type == "founder"][0]{
  _id,
  name,
  title,
  tagline,
  bio,
  shortBio,
  mission,
  vision,
  website,
  socials,
  image{
    alt,
    asset->{
      _id,
      url
    }
  },
  companies[]{
    name,
    role,
    description
  },
  achievements[],
  authorityBadges[],
  quote
}`

// Fetch landing page by slug
export async function getLandingPageBySlug(slug: string) {
  return fetch(
    groq`*[_type == "landingPage" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      hero,
      features,
      benefits,
      pricing,
      faq,
      cta,
      seo{
        seoTitle,
        seoDescription,
        ogImage,
        canonicalUrl
      }
    }`,
    { slug }
  )
}

// Fetch documentation by slug
export async function getDocumentationBySlug(slug: string) {
  return fetch(
    groq`*[_type == "documentation" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      category->{
        _id,
        title
      },
      content,
      codeExamples,
      seo{
        seoTitle,
        seoDescription,
        ogImage,
        canonicalUrl
      }
    }`,
    { slug }
  )
}

// Export raw GROQ queries for direct client usage
export const getDocumentationBySlugQuery = groq`*[_type == "documentation" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  category->{
    _id,
    title
  },
  content,
  codeExamples,
  seo{
    seoTitle,
    seoDescription,
    ogImage,
    canonicalUrl
  }
}`

// Fetch all case studies
export async function getCaseStudies() {
  return fetch(
    groq`*[_type == "caseStudy"]{
      _id,
      companyName,
      logo{
        alt,
        asset->{
          _id,
          url
        }
      },
      industry->{
        _id,
        title
      },
      problem,
      solution,
      results,
      metrics,
      testimonial
    }`
  )
}

// Fetch case study by slug
export async function getCaseStudyBySlug(slug: string) {
  return fetch(
    groq`*[_type == "caseStudy" && slug.current == $slug][0]{
      _id,
      companyName,
      logo{
        alt,
        asset->{
          _id,
          url
        }
      },
      industry->{
        _id,
        title
      },
      problem,
      solution,
      results,
      metrics,
      testimonial
    }`,
    { slug }
  )
}

// Fetch all testimonials
export async function getTestimonials() {
  return fetch(
    groq`*[_type == "testimonial"]{
      _id,
      name,
      company,
      designation,
      photo{
        alt,
        asset->{
          _id,
          url
        }
      },
      quote,
      rating
    }`
  )
}

// Fetch settings
export async function getSettings() {
  return fetch(
    groq`*[_type == "settings"][0]{
      _id,
      siteTitle,
      siteDescription,
      logo{
        alt,
        asset->{
          _id,
          url
        }
      },
      footerLinks[]{
        title,
        url
      },
      socialLinks[]{
        platform,
        url,
        icon{
          alt,
          asset->{
            _id,
            url
          }
        }
      },
      announcementBar
    }`
  )
}

// Export for case studies query used in app/case-studies/page.tsx
export const getAllCaseStudiesQuery = `*[_type == "caseStudy"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt
}`
