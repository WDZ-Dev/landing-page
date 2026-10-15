// The three orbits around the agent core. Each is one area of work the story zooms into.
export const ORBITS: {
  key: string
  icon: string
  name: string
  headline: string
  body: string
  color: string
  radius: number
  tilt: [number, number, number]
  angle: number
  speed: number
  /** tools named on our integrations list; shown as plain text */
  tools: string[]
  /** a three-beat flow: what arrives, what the agent does, how it ends */
  tasks: { label: string; detail: string; kind: 'in' | 'work' | 'done' }[]
}[] = [
  {
    key: 'communication',
    icon: 'chat',
    name: 'Communication',
    headline: 'Every message answered.',
    body: 'Email, chat and WhatsApp handled in your voice, in seconds, with anything sensitive routed to you.',
    color: '#86d6b9',
    radius: 2.0,
    tilt: [1.15, 0.2, 0],
    angle: 0.5,
    speed: 0.22,
    tools: ['Gmail', 'Outlook', 'WhatsApp', 'Slack'],
    tasks: [
      { label: 'New message', detail: '“Can I get a refund?”', kind: 'in' },
      { label: 'Refund issued', detail: 'Reply sent in your voice', kind: 'work' },
      { label: 'CRM updated', detail: 'Nothing left for you to do', kind: 'done' },
    ],
  },
  {
    key: 'documents',
    icon: 'document',
    name: 'Documents',
    headline: 'Paperwork that files itself.',
    body: 'Contracts, invoices and intake forms read, checked and filed, with the numbers that matter pulled out.',
    color: '#8fb4e3',
    radius: 2.65,
    tilt: [1.35, -0.5, 0.3],
    angle: 2.6,
    speed: -0.16,
    tools: ['PDFs', 'Google Drive', 'QuickBooks'],
    tasks: [
      { label: 'Invoice arrives', detail: 'PDF from a supplier', kind: 'in' },
      { label: 'Details pulled out', detail: '$8,450 due, Net 30', kind: 'work' },
      { label: 'Filed and flagged', detail: 'Due-date reminder set', kind: 'done' },
    ],
  },
  {
    key: 'operations',
    icon: 'calendar',
    name: 'Operations',
    headline: 'Your week, already organized.',
    body: 'Scheduling, reminders and reports run on their own, so Monday starts with answers instead of busywork.',
    color: '#e2bd7f',
    radius: 3.3,
    tilt: [1.0, 0.65, -0.2],
    angle: 4.4,
    speed: 0.12,
    tools: ['Google Calendar', 'Stripe', 'Shopify'],
    tasks: [
      { label: 'Meeting request', detail: '“Can we meet Thursday?”', kind: 'in' },
      { label: 'Time found', detail: 'Booked Thu 2:30 pm', kind: 'work' },
      { label: 'Weekly report', detail: 'In your inbox Monday, 7 am', kind: 'done' },
    ],
  },
]
