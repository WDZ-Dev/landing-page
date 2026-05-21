import posthog from 'posthog-js'

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined
const HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com'

let initialized = false

export function initAnalytics() {
  if (initialized || !KEY) return
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false, // we fire $pageview manually on route changes
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
  })
  initialized = true
}

export function trackPageview(path: string) {
  if (!initialized) return
  posthog.capture('$pageview', { $current_url: window.location.origin + path })
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return
  posthog.capture(event, properties)
}
