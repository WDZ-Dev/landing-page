export type MailContent = {
  rows: { initials: string; name: string; subject: string; time: string; bg: string }[]
  aiStatus: string
}

export type ChatContent = {
  custInitial: string; custName: string; custTime: string; custMsg: string
  agentMsg: string
}

export type DocContent = {
  fileName: string; pages: string
  items: string[]
}

export type CalContent = {
  events: { day: number; time: string; label: string; isNew?: boolean }[]
  aiStatus: string
}

export type ReceiptContent = {
  title: string
  items: { name: string; amount: string }[]
  total: string
  aiStatus: string
}

export type ChartContent = {
  title: string
  rows: { label: string; pct: string; value: string }[]
  aiStatus: string
}

export type ShareContent = {
  posts: { platform: string; text: string; status: string; statusClass: string }[]
  aiStatus: string
}

export type DollarContent = {
  amount: string; change: string
  aiStatus: string
}

export type CheckContent = {
  rows: { text: string; score: string }[]
  total: string
}

export type ShieldContent = {
  status: string; details: string; aiStatus: string
}

export type SearchContent = {
  query: string
  results: { doc: string; match: string }[]
  aiStatus: string
}

export type PencilContent = {
  lines: string[]
  typingLine: string
  ghostLines: string[]
  aiStatus: string
}

export type ClipContent = {
  fields: { label: string; value: string }[]
  aiStatus: string
}

export type BoxContent = {
  items: { name: string; stock: string; stockClass: string }[]
  aiStatus: string
}

export type TagContent = {
  tags: string[]
  aiStatus: string
}

export type HomeContent = {
  price: string; address: string
  tags: string[]
  aiStatus: string
}

export type StarContent = {
  rating: string; count: string
  bars: { label: string; pct: string }[]
  aiStatus: string
}

export type AllContent = {
  mail?: MailContent
  chat?: ChatContent
  document?: DocContent
  calendar?: CalContent
  receipt?: ReceiptContent
  chart?: ChartContent
  share?: ShareContent
  dollar?: DollarContent
  check?: CheckContent
  shield?: ShieldContent
  search?: SearchContent
  pencil?: PencilContent
  clipboard?: ClipContent
  box?: BoxContent
  tag?: TagContent
  home?: HomeContent
  star?: StarContent
}

const INDUSTRY_CONTENT: Record<string, AllContent> = {
  'Your Company': {
    mail: {
      rows: [
        { initials: 'JD', name: 'John Davis', subject: 'Re: Q2 proposal follow-up', time: '2m', bg: 'mk-accent-bg' },
        { initials: 'SK', name: 'Sarah Kim', subject: 'Invoice #1042 — payment conf...', time: '8m', bg: 'mk-warm-bg' },
        { initials: 'MR', name: 'Mike Ross', subject: 'Meeting rescheduled to Friday', time: '14m', bg: 'mk-gold-bg' },
      ],
      aiStatus: '3 auto-replies drafted & sent',
    },
    chat: {
      custInitial: 'C', custName: 'Customer', custTime: '9:41 AM',
      custMsg: 'Hi, I need to update my shipping address for order #4821',
      agentMsg: "I've updated the address on order #4821. Confirmation email on its way!",
    },
    document: {
      fileName: 'Report_Q2.xlsx', pages: '12 sheets',
      items: ['Revenue: $142K', 'Expenses: $89K', '47 records processed', 'Summary generated'],
    },
    calendar: {
      events: [
        { day: 0, time: '9:00', label: 'Team sync' },
        { day: 2, time: '9:00', label: 'Client call' },
        { day: 1, time: '11:00', label: 'AI booked', isNew: true },
        { day: 4, time: '11:00', label: 'Review' },
        { day: 3, time: '2:00', label: 'AI booked', isNew: true },
      ],
      aiStatus: '2 appointments auto-scheduled',
    },
    receipt: {
      title: 'Invoice #1042',
      items: [{ name: 'Website redesign', amount: '$3,200' }, { name: 'SEO audit', amount: '$800' }, { name: 'Hosting (annual)', amount: '$480' }],
      total: '$4,480',
      aiStatus: 'Reminder sent · Payment tracked',
    },
    chart: {
      title: 'Weekly Report',
      rows: [
        { label: 'Revenue', pct: '82%', value: '$24.8K' },
        { label: 'New Leads', pct: '65%', value: '142' },
        { label: 'Deals Won', pct: '48%', value: '38' },
        { label: 'Retention', pct: '91%', value: '94%' },
      ],
      aiStatus: 'Report auto-generated from live data',
    },
  },

  'Small Businesses': {
    receipt: {
      title: 'Invoice #327',
      items: [{ name: 'Logo design', amount: '$650' }, { name: 'Business cards (500)', amount: '$120' }, { name: 'Consulting (3hr)', amount: '$375' }],
      total: '$1,145',
      aiStatus: 'Payment reminder sent to client',
    },
    mail: {
      rows: [
        { initials: 'TL', name: 'Tom Lee', subject: 'Thanks for the estimate!', time: '5m', bg: 'mk-accent-bg' },
        { initials: 'AP', name: 'Amy Park', subject: 'Can we schedule a demo?', time: '12m', bg: 'mk-warm-bg' },
        { initials: 'RJ', name: 'Raj Patel', subject: 'Referral for your services', time: '30m', bg: 'mk-gold-bg' },
      ],
      aiStatus: '3 follow-ups sent automatically',
    },
    share: {
      posts: [
        { platform: 'Twitter', text: 'New blog: 5 tips for small biz...', status: 'Queued', statusClass: 'scheduled' },
        { platform: 'LinkedIn', text: 'Excited to share our Q2 results...', status: '✓ Sent', statusClass: 'sent' },
        { platform: 'Instagram', text: 'Meet the team behind the magic...', status: 'Queued', statusClass: 'scheduled' },
      ],
      aiStatus: 'Copy generated · 2 posts scheduled',
    },
    dollar: {
      amount: '8,240', change: '↑ 18.2% from last month',
      aiStatus: '34 expenses auto-categorized',
    },
    check: {
      rows: [
        { text: 'Budget: $5K+', score: '+20' },
        { text: 'Replied within 24hr', score: '+15' },
        { text: 'Visited pricing page', score: '+10' },
        { text: 'Referred by client', score: '+25' },
      ],
      total: 'Score: <strong>70/100</strong> — Hot Lead',
    },
    chart: {
      title: 'Weekly Snapshot',
      rows: [
        { label: 'Revenue', pct: '58%', value: '$8.2K' },
        { label: 'Website', pct: '72%', value: '1,240' },
        { label: 'Leads', pct: '45%', value: '28' },
        { label: 'Reviews', pct: '88%', value: '4.7★' },
      ],
      aiStatus: 'Weekly digest auto-generated',
    },
  },

  'Law Firms': {
    document: {
      fileName: 'NDA_ClientCo.pdf', pages: '32 pages',
      items: ['2 parties identified', 'Non-compete: 2yr radius', 'Liability cap: $500K', '1 risk clause flagged'],
    },
    search: {
      query: 'breach of contract clause...',
      results: [
        { doc: 'Contract_v3.pdf', match: '§4.2 — Termination clause' },
        { doc: 'Amendment_1.pdf', match: '§2.1 — Liability cap modified' },
        { doc: 'NDA_signed.pdf', match: '§7 — Non-compete scope' },
      ],
      aiStatus: '847 pages analyzed · 3 matches',
    },
    pencil: {
      lines: ['This Mutual Non-Disclosure Agreement', '("Agreement") is entered into by and'],
      typingLine: 'between [Party A] and [Party B]',
      ghostLines: ['for the purpose of protecting', 'confidential information disclosed...'],
      aiStatus: 'NDA draft generated from template',
    },
    clipboard: {
      fields: [
        { label: 'Client Name', value: 'Sarah Johnson' },
        { label: 'Case Type', value: 'Employment dispute' },
        { label: 'Jurisdiction', value: 'California' },
      ],
      aiStatus: 'Case routed to employment team',
    },
  },

  'Healthcare': {
    calendar: {
      events: [
        { day: 0, time: '9:00', label: 'Dr. Usman' },
        { day: 2, time: '9:00', label: 'Lab work' },
        { day: 1, time: '11:00', label: 'AI booked', isNew: true },
        { day: 4, time: '11:00', label: 'Follow-up' },
        { day: 3, time: '2:00', label: 'AI booked', isNew: true },
      ],
      aiStatus: '2 patient visits auto-scheduled',
    },
    shield: {
      status: 'Verified', details: 'Coverage active · BlueCross PPO #A-4821',
      aiStatus: 'Auto-verified in 2.1 seconds',
    },
    document: {
      fileName: 'Visit_Notes_042.pdf', pages: '3 pages',
      items: ['Diagnosis: Type 2 DM', 'Rx: Metformin 500mg', 'Follow-up: 3 months', 'Lab order: HbA1c'],
    },
    chat: {
      custInitial: 'P', custName: 'Patient', custTime: '10:15 AM',
      custMsg: "Hi, when is my next follow-up with Dr. Usman?",
      agentMsg: "Your next visit is Thursday at 2 PM with Dr. Usman. I've sent a reminder to your phone.",
    },
  },

  'Real Estate': {
    home: {
      price: '$425,000', address: '1234 Oak Avenue, Austin TX',
      tags: ['3 bed', '2 bath', '1,840 sqft'],
      aiStatus: 'Listing copy auto-generated from MLS',
    },
    check: {
      rows: [
        { text: 'Pre-approved: $500K', score: '+30' },
        { text: 'Viewed 5+ listings', score: '+15' },
        { text: 'Timeline: 30 days', score: '+20' },
        { text: 'Engaged with agent', score: '+10' },
      ],
      total: 'Score: <strong>75/100</strong> — Ready to Buy',
    },
    document: {
      fileName: 'Purchase_Agreement.pdf', pages: '24 pages',
      items: ['Buyer/Seller identified', 'Price: $425,000', 'Contingencies: 3 found', 'Closing: June 15'],
    },
    chart: {
      title: 'Comp Analysis',
      rows: [
        { label: '1234 Oak Ave', pct: '78%', value: '$425K' },
        { label: '1300 Elm St', pct: '85%', value: '$448K' },
        { label: '987 Pine Rd', pct: '62%', value: '$395K' },
        { label: 'Avg $/sqft', pct: '72%', value: '$231' },
      ],
      aiStatus: 'Market report from 12 recent sales',
    },
  },

  'E-Commerce': {
    tag: {
      tags: ['electronics', 'wireless', 'premium', 'new arrival'],
      aiStatus: 'SEO tags & description generated',
    },
    chat: {
      custInitial: 'C', custName: 'Customer', custTime: '2:30 PM',
      custMsg: 'I received the wrong size. Can I exchange my order #6102?',
      agentMsg: "I've initiated the exchange. A prepaid label is on its way to your email!",
    },
    box: {
      items: [
        { name: 'Wireless Earbuds Pro', stock: '142 in stock', stockClass: 'in-stock' },
        { name: 'USB-C Hub Adapter', stock: '12 left — reorder', stockClass: 'low-stock' },
        { name: 'Phone Stand MagSafe', stock: '89 in stock', stockClass: 'in-stock' },
      ],
      aiStatus: 'Reorder alert sent for USB-C Hub',
    },
    star: {
      rating: '4.6', count: '1,247 reviews',
      bars: [
        { label: '5★', pct: '68%' },
        { label: '4★', pct: '22%' },
        { label: '3★', pct: '6%' },
      ],
      aiStatus: 'Sentiment analysis from 1,247 reviews',
    },
  },

  'Construction': {
    clipboard: {
      fields: [
        { label: 'Project', value: 'Riverside Office Complex' },
        { label: 'Bid Amount', value: '$2.4M' },
        { label: 'Deadline', value: 'June 30, 2026' },
      ],
      aiStatus: 'Bid assembled from 4 sub-quotes',
    },
    document: {
      fileName: 'Safety_Inspection.pdf', pages: '18 pages',
      items: ['OSHA compliance: Pass', 'Fire exits: Verified', 'PPE audit: 3 items', 'Permit #: BLD-2026-41'],
    },
    calendar: {
      events: [
        { day: 0, time: '9:00', label: 'Framing crew' },
        { day: 2, time: '9:00', label: 'Inspection' },
        { day: 1, time: '11:00', label: 'AI booked', isNew: true },
        { day: 4, time: '11:00', label: 'Plumbing' },
        { day: 3, time: '2:00', label: 'AI booked', isNew: true },
      ],
      aiStatus: '2 sub crews auto-scheduled',
    },
    chart: {
      title: 'Budget Tracker',
      rows: [
        { label: 'Materials', pct: '72%', value: '$840K' },
        { label: 'Labor', pct: '65%', value: '$720K' },
        { label: 'Equipment', pct: '38%', value: '$180K' },
        { label: 'Permits', pct: '90%', value: '$45K' },
      ],
      aiStatus: 'Costs tracked across 3 job sites',
    },
  },
}

export function getContent(industry: string, iconKey: string) {
  return INDUSTRY_CONTENT[industry]?.[iconKey as keyof AllContent]
}
