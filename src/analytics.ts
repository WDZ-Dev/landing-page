import type { PostHog } from 'posthog-js'

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined
const HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com'

let client: PostHog | null = null
// Events fired before the async import resolves are queued, then flushed in order.
const queue: Array<(ph: PostHog) => void> = []

export function initAnalytics() {
  if (client || !KEY) return
  void import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: HOST,
      capture_pageview: false, // we fire $pageview manually on route changes
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true,
      persistence: 'localStorage+cookie',
    })
    client = posthog
    for (const fn of queue) fn(posthog)
    queue.length = 0
  })
}

function enqueue(fn: (ph: PostHog) => void) {
  if (client) fn(client)
  else if (KEY) queue.push(fn)
}

export function trackPageview(path: string) {
  enqueue((ph) => ph.capture('$pageview', { $current_url: window.location.origin + path }))
}

export function track(event: string, properties?: Record<string, unknown>) {
  enqueue((ph) => ph.capture(event, properties))
}
