/**
 * Programmatic Landing Page
 * Dynamic pages for each industry/use case combination
 */

import { notFound } from 'next/navigation'
import { getLandingPage } from '@/lib/growth/page-generator'
import LeadCaptureForm from '@/components/growth/LeadCaptureForm'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ industry: string; usecase: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { industry, usecase } = await params
  const slug = `${industry}/${usecase}`
  
  const page = await getLandingPage(slug)
  
  if (!page) {
    return {
      title: 'Kritvia - AI Business Operating System',
    }
  }
  
  return {
    title: page.title,
    description: page.meta_description,
    openGraph: {
      title: page.h1,
      description: page.meta_description,
      type: 'website',
    },
  }
}

export default async function LandingPage({ params }: PageProps) {
  const { industry, usecase } = await params
  const slug = `${industry}/${usecase}`
  
  const page = await getLandingPage(slug)
  
  if (!page) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                {page.hero_headline}
              </h1>
              <p className="text-xl text-indigo-100 mb-8">
                {page.hero_subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#signup"
                  className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors text-center"
                >
                  {page.cta_text}
                </a>
                <a
                  href="#demo"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors text-center"
                >
                  See Demo
                </a>
              </div>
            </div>
            
            {/* Lead Form */}
            <div id="signup" className="bg-white rounded-xl shadow-2xl p-6">
              <LeadCaptureForm
                source={slug}
                cta={page.cta_text}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stop Struggling With These Problems?
            </h2>
            <p className="text-xl text-gray-600">
              See how Kritvia solves your biggest challenges
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.pain_points.map((point, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The AI-Powered Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {page.solution_content}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {page.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Proven Results</h2>
          <p className="text-xl text-indigo-100 mb-8">
            {page.roi_content}
          </p>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold">40%</p>
              <p className="text-indigo-200">More Leads</p>
            </div>
            <div>
              <p className="text-4xl font-bold">3x</p>
              <p className="text-indigo-200">Faster Close</p>
            </div>
            <div>
              <p className="text-4xl font-bold">15hrs</p>
              <p className="text-indigo-200">Saved/Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {page.faq && page.faq.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {page.faq.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses already growing with Kritvia
          </p>
          <a
            href="#signup"
            className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            {page.cta_text}
          </a>
        </div>
      </section>

      {/* Related Links */}
      {page.internal_links && page.internal_links.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {page.internal_links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
