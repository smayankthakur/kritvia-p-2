import { groq } from 'next-sanity';

// Blog queries
export const getAllPostsQuery = groq`
  *[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    category->{title, slug},
    author->{name, photo},
    mainImage
  }
`;

export const getPostBySlugQuery = groq`
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    body,
    category->{title, slug},
    author->{name, bio, photo},
    mainImage,
    seo
  }
`;

export const getRecentPostsQuery = groq`
  *[_type == "blog"] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    category->{title, slug},
    mainImage
  }
`;

// Case Study queries
export const getAllCaseStudiesQuery = groq`
  *[_type == "caseStudy"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    client,
    industry,
    summary,
    results,
    heroImage,
    technologies
  }
`;

export const getCaseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    client,
    industry,
    challenge,
    solution,
    results,
    body,
    heroImage,
    technologies,
    testimonial
  }
`;

// Service queries
export const getAllServicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    tagline,
    description,
    icon,
    features,
    featured
  }
`;

export const getServiceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    tagline,
    description,
    icon,
    heroImage,
    features,
    benefits,
    technologies,
    content
  }
`;

// Solution queries
export const getAllSolutionsQuery = groq`
  *[_type == "solution"] | order(order asc) {
    _id,
    title,
    slug,
    tagline,
    description,
    icon,
    featured
  }
`;

export const getSolutionBySlugQuery = groq`
  *[_type == "solution" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    tagline,
    description,
    icon,
    heroImage,
    useCases,
    content,
    relatedServices[]->{title, slug, icon},
    relatedCaseStudies[]->{title, slug, client, heroImage}
  }
`;

// Product queries
export const getAllProductsQuery = groq`
  *[_type == "product"] | order(_createdAt asc) {
    _id,
    title,
    slug,
    tagline,
    description,
    heroImage,
    features
  }
`;

export const getProductBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    tagline,
    description,
    heroImage,
    features,
    body,
    screenshots
  }
`;

// Technology queries
export const getAllTechnologiesQuery = groq`
  *[_type == "technology"] | order(order asc) {
    _id,
    name,
    slug,
    logo,
    logoUrl,
    description,
    category,
    featured
  }
`;

export const getFeaturedTechnologiesQuery = groq`
  *[_type == "technology" && featured == true] | order(order asc) {
    _id,
    name,
    logo,
    logoUrl,
    category
  }
`;

// Team queries
export const getAllTeamMembersQuery = groq`
  *[_type == "team"] | order(order asc) {
    _id,
    name,
    role,
    department,
    bio,
    photo,
    linkedin,
    twitter,
    expertise,
    featured
  }
`;

export const getFeaturedTeamMembersQuery = groq`
  *[_type == "team" && featured == true] | order(order asc) {
    _id,
    name,
    role,
    department,
    bio,
    photo,
    linkedin,
    twitter
  }
`;

// Industry queries
export const getAllIndustriesQuery = groq`
  *[_type == "industry"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    icon,
    heroImage
  }
`;

export const getIndustryBySlugQuery = groq`
  *[_type == "industry" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    heroImage,
    challenges,
    solutions,
    content
  }
`;

// Testimonial queries
export const getAllTestimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id,
    name,
    role,
    company,
    photo,
    quote,
    rating,
    companyLogo,
    featured
  }
`;

export const getFeaturedTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(order asc) {
    _id,
    name,
    role,
    company,
    photo,
    quote,
    rating,
    companyLogo
  }
`;

// Site settings
export const getSiteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    description,
    logo,
    favicon,
    socialLinks,
    seo
  }
`;
