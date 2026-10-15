# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: owners and operators of small businesses who are not technical. Verticals named on the site: general small business, law firms, healthcare practices, e-commerce, construction. They are evaluating whether an outside team can take repetitive operational work (email, support, documents, scheduling, invoicing, reporting) off their plate without them learning new software.

Secondary (OpenClaw page): businesses that want an AI assistant team running privately on hardware they own.

## Product Purpose

WDZ Solutions is a three-founder AI services firm in Los Angeles. It designs, builds, deploys, and maintains custom AI agents ("AI employees") that plug into a client's existing tools. Success on the site = a visitor submits the contact modal (landing) or the quote form (/openclaw).

## Positioning

Founder-built and founder-run: the people who sell the work are the ML engineers and researchers who build it (UMich AI Lab PhD researcher, ML engineer with Latham & Watkins background, former Qualcomm AI solutions developer). Done-for-you, not a self-serve platform: no setup or technical knowledge required from the client.

OpenClaw service: deploys the open-source OpenClaw assistant stack on client-owned hardware; data does not leave the building.

## Operating Context

- Engagement process: Discovery, Design, Deploy, Optimize. OpenClaw: typically 2 to 4 weeks to go-live.
- Lead capture: waitlist/contact modal and OpenClaw quote form, both writing to Firebase Firestore.
- Data handling commitments: no model training on client data, minimal retention (deletion within 30 days of engagement end), written agreements before data changes hands, NDA on request via contact@wdzsolutions.com.

## Capabilities and Constraints

- Stack: React 19 + TypeScript + Vite, react-router-dom, Firebase, deployed to Cloudflare (wrangler).
- Routes: `/` landing, `/openclaw`, `/privacy`, `/terms`.
- Industry tab content and agent use cases live in `src/components/Features.tsx` and `mockupContent.ts`.

## Brand Commitments

- Name: WDZ Solutions. Logo: `public/logo.png` (white WDZ wordmark on deep green, approx #13504A).
- Binding: the logo's core color scheme (deep green + white) stays. Everything else about the visual world is open to change.
- Must not feel like an 'AI startup' (dark neon, glowing gradients, jargon) or a generic SaaS template.
- Voice: plain, reassuring, jargon-free for non-technical owners.
- OpenClaw page references the OpenClaw mascot (Molty the lobster) and its orange-red color.

## Evidence on Hand

- Founder headshots, names, bios, LinkedIn and personal sites (`public/headshots/`, `src/components/About.tsx`).
- Company LinkedIn: https://www.linkedin.com/company/wdzsolutions
- Absent: client logos, testimonials, case studies, verified outcome metrics. The current stats (87%, 3x, 40%, 99.9% SLA) are placeholders and must not be featured as fact. Do not fabricate customers or results.

## Product Principles

1. Clarity over cleverness: a non-technical owner must understand what they get in one read.
2. Show the work: demonstrate agents doing real tasks rather than claiming outcomes.
3. Credibility comes from the founders and the written data commitments, not invented numbers.
4. One clear action per page: contact (landing) or quote (OpenClaw).
