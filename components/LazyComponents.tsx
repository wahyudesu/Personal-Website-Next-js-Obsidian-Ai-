'use client'

import dynamic from 'next/dynamic'

// Lazy load heavy UI components
export const LazySearchProvider = dynamic(
  () => import('pliny/search').then((mod) => mod.SearchProvider),
  {
    loading: () => null,
    ssr: false,
  }
)

export const LazyMusicPlayer = dynamic(() => import('./MusicPlayer'), {
  loading: () => (
    <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[16px]" />
  ),
  ssr: false,
})

export const LazyComments = dynamic(() => import('./Comments'), {
  loading: () => (
    <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
  ),
  ssr: false,
})

// Lazy load analytics
export const LazyAnalytics = dynamic(
  () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
  {
    loading: () => null,
    ssr: false,
  }
)

// Lazy load PostHog
export const LazyPostHog = dynamic(() => import('../app/providers').then((mod) => mod.CSPostHogProvider), {
  loading: () => null,
  ssr: false,
})
