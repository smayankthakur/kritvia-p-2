import { groq } from 'next-sanity'
import { client } from './client'

// Fetch all posts with essential fields
export async function getPosts() {
  return client.fetch(
    groq`*[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      image {
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
    }`
  )
}

// Fetch all post slugs for generateStaticParams
export async function getAllPostSlugs() {
  return client.fetch(
    groq`*[_type == "post" && defined(slug.current)]{
      slug{
        current
      }
    }`
  )
}

// Fetch a single post by slug with essential fields
export async function getPostBySlug(slug: string) {
  return client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      image{
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
        bio,
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
        slug,
        description
      }
    }`,
    { slug }
  )
}

// Fetch all products with essential fields
export async function getProducts() {
  return client.fetch(
    groq`*[_type == "product" && published == true] | order(_createdAt desc) {
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
      features,
      category->{
        _id,
        title,
        slug
      }
    }`
  )
}

// Fetch all product slugs for generateStaticParams
export async function getAllProductSlugs() {
  return client.fetch(
    groq`*[_type == "product" && defined(slug.current)]{
      slug{
        current
      }
    }`
  )
}

// Fetch a single product by slug with essential fields
export async function getProductBySlug(slug: string) {
  return client.fetch(
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
  return client.fetch(
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
  return client.fetch(
    groq`*[_type == "page" && defined(slug.current)]{
      slug{
        current
      }
    }`
  )
}

// Fetch a single page by slug with essential fields
export async function getPageBySlug(slug: string) {
  return client.fetch(
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
  return client.fetch(
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
