import { S } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = S.list()
  .title('Content')
  .items([
    S.listItem()
      .title('Site Settings')
      .icon(() => S.document().icon())
      .child(
        S.document()
          .schemaType('siteSettings')
          .documentId('siteSettings')
      ),
    S.divider(),
    S.listItem()
      .title('Blog')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('post')
          .title('Blog Posts')
      ),
    S.listItem()
      .title('Blog Categories')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('category')
          .title('Blog Categories')
      ),
    S.listItem()
      .title('Blog Tags')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('tag')
          .title('Blog Tags')
      ),
    S.divider(),
    S.listItem()
      .title('Pages')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('page')
          .title('Pages')
      ),
    S.listItem()
      .title('Landing Pages')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('landingPage')
          .title('Landing Pages')
      ),
    S.divider(),
    S.listItem()
      .title('Documentation')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('documentation')
          .title('Documentation')
      ),
    S.divider(),
    S.listItem()
      .title('Products')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('product')
          .title('Products')
      ),
    S.listItem()
      .title('Services')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('service')
          .title('Services')
      ),
    S.listItem()
      .title('Solutions')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('solution')
          .title('Solutions')
      ),
    S.listItem()
      .title('Case Studies')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('caseStudy')
          .title('Case Studies')
      ),
    S.divider(),
    S.listItem()
      .title('Founder')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('founder')
          .title('Founder')
      ),
    S.listItem()
      .title('Team')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('team')
          .title('Team')
      ),
    S.listItem()
      .title('Testimonials')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('testimonial')
          .title('Testimonials')
      ),
    S.listItem()
      .title('FAQs')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('faq')
          .title('FAQs')
      ),
    S.listItem()
      .title('Authors')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('author')
          .title('Authors')
      ),
    S.listItem()
      .title('Industries')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('industry')
          .title('Industries')
      ),
    S.listItem()
      .title('Technologies')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('technology')
          .title('Technologies')
      ),
    S.listItem()
      .title('Features')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('feature')
          .title('Features')
      ),
    S.listItem()
      .title('Pricing Plans')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('pricingPlan')
          .title('Pricing Plans')
      ),
    S.listItem()
      .title('Business Products')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('businessProduct')
          .title('Business Products')
      ),
    S.listItem()
      .title('Business Services')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('businessService')
          .title('Business Services')
      ),
    S.listItem()
      .title('Business Solutions')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('businessSolution')
          .title('Business Solutions')
      ),
    S.listItem()
      .title('Business Case Studies')
      .icon(() => S.document().icon())
      .child(
        S.documentTypeList('businessCaseStudy')
          .title('Business Case Studies')
      ),
  ])