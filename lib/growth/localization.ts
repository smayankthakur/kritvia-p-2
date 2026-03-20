/**
 * Localization System
 * Multi-language support for global expansion
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface Locale {
  code: string
  name: string
  nativeName: string
  flag: string
  rtl?: boolean
  active: boolean
}

export interface Translation {
  key: string
  translations: Record<string, string>
}

// Supported locales
export const locales: Locale[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', active: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', active: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', active: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', active: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', active: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', active: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', active: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', active: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true, active: false },
]

// Get active locales
export function getActiveLocales(): Locale[] {
  return locales.filter(l => l.active)
}

// Get locale by code
export function getLocale(code: string): Locale | undefined {
  return locales.find(l => l.code === code)
}

// Core translations
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',

    // Hero
    'hero.title': 'The AI Operating System for Your Business',
    'hero.subtitle': 'Automate your entire business with AI-powered CRM, Sales, and Marketing',
    'hero.cta.start': 'Start Free',
    'hero.cta.demo': 'Book Demo',

    // Features
    'features.title': 'Powerful Features',
    'features.ai': 'AI Assistant',
    'features.crm': 'CRM',
    'features.automation': 'Automation',

    // Pricing
    'pricing.title': 'Simple, Transparent Pricing',
    'pricing.free': 'Free',
    'pricing.starter': 'Starter',
    'pricing.pro': 'Pro',
    'pricing.enterprise': 'Enterprise',
    'pricing.monthly': '/month',
    'pricing.yearly': '/year',
    'pricing.cta': 'Get Started',

    // Dashboard
    'dashboard.overview': 'Overview',
    'dashboard.leads': 'Leads',
    'dashboard.deals': 'Deals',
    'dashboard.ai': 'AI Assistant',
    'dashboard.settings': 'Settings',
  },
  hi: {
    'nav.home': 'होम',
    'nav.features': 'विशेषताएं',
    'nav.pricing': 'मूल्य निर्धारण',
    'nav.blog': 'ब्लॉग',
    'nav.contact': 'संपर्क',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.login': 'लॉग इन',
    'nav.signup': 'साइन अप',
    'hero.title': 'आपके व्यवसाय के लिए AI ऑपरेटिंग सिस्टम',
    'hero.subtitle': 'AI-संचालित CRM, बिक्री और मार्केटिंग से अपने पूरे व्यवसेश को स्वचालित करें',
    'hero.cta.start': 'मुफ्त शुरू करें',
    'hero.cta.demo': 'डेमो बुक करें',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.features': 'Características',
    'nav.pricing': 'Precios',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.dashboard': 'Panel',
    'nav.login': 'Iniciar sesión',
    'nav.signup': 'Registrarse',
    'hero.title': 'El Sistema Operativo de IA para su Negocio',
    'hero.subtitle': 'Automatice todo su negocio con CRM, Ventas y Marketing impulsados por IA',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.features': 'Fonctionnalités',
    'nav.pricing': 'Tarifs',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Tableau de bord',
    'nav.login': 'Connexion',
    'nav.signup': "S'inscrire",
    'hero.title': "Le Système d'IA pour Votre Entreprise",
    'hero.subtitle': 'Automatisez toute votre entreprise avec CRM, Ventes et Marketing IA',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.features': 'Funktionen',
    'nav.pricing': 'Preise',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Anmelden',
    'nav.signup': 'Registrieren',
    'hero.title': 'Das KI-Betriebssystem für Ihr Unternehmen',
    'hero.subtitle': 'Automatisieren Sie Ihr gesamtes Unternehmen mit KI-gestütztem CRM',
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.features': '機能',
    'nav.pricing': '料金',
    'nav.blog': 'ブログ',
    'nav.contact': 'お問い合わせ',
    'nav.dashboard': 'ダッシュボード',
    'nav.login': 'ログイン',
    'nav.signup': '登録',
    'hero.title': 'ビジネス向けAIオペレーティングシステム',
    'hero.subtitle': 'AI搭載のCRMでビジネス全体を自動化',
  },
  pt: {
    'nav.home': 'Início',
    'nav.features': 'Recursos',
    'nav.pricing': 'Preços',
    'nav.blog': 'Blog',
    'nav.contact': 'Contato',
    'nav.dashboard': 'Painel',
    'nav.login': 'Entrar',
    'nav.signup': 'Cadastrar',
    'hero.title': 'O Sistema de IA para Seu Negócio',
    'hero.subtitle': 'Automatize todo seu negócio com CRM, Vendas e Marketing com IA',
  },
}

// Get translation
export function t(key: string, locale: string = 'en'): string {
  return translations[locale]?.[key] || translations['en']?.[key] || key
}

// Translate page content
export async function translateContent(
  content: string,
  targetLocale: string
): Promise<string> {
  // In production, use OpenAI for dynamic translation
  // For now, return the content with locale marker
  return `[${targetLocale}] ${content}`
}

// Get user's locale from request
export function getUserLocale(): string {
  // In production, get from request headers, cookies, or geo-IP
  return 'en'
}

export default {
  locales,
  getActiveLocales,
  getLocale,
  t,
  translateContent,
  getUserLocale,
}
