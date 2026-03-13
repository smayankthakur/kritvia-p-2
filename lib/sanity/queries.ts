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
      }
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
      bio,
      image{
        alt,
        asset->{
          _id,
          url
        }
      },
      socials[]{
        platform,
        url
      }
    }`
  )
}

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
