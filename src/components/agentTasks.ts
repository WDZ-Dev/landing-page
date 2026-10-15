export interface AgentTask {
  app: string
  steps: string[]
  result: string
}

// Generic runs keyed by job type; every value is illustrative sample data
export const AGENT_TASKS: Record<string, AgentTask> = {
  mail: { app: 'Inbox', steps: ['Read 3 new emails', 'Sorted by priority', 'Drafted replies in your tone'], result: '3 replies ready to send' },
  chat: { app: 'Live chat', steps: ['New customer question', 'Found the answer in your docs', 'Replied and logged it'], result: 'Answered in 4 seconds' },
  document: { app: 'Documents', steps: ['Opened Contract_Q2.pdf', 'Pulled key terms and dates', 'Filed it and flagged the renewal'], result: 'Net 30 · $8,450 due Apr 12' },
  calendar: { app: 'Calendar', steps: ['Request from a customer', 'Checked open slots', 'Booked and sent the invite'], result: 'Thu 2:30 pm confirmed' },
  receipt: { app: 'Invoices', steps: ['Found 4 overdue invoices', 'Sent friendly reminders', 'Scheduled the follow-up'], result: '$12,300 now in motion' },
  chart: { app: 'Reports', steps: ['Pulled data from 3 tools', 'Spotted this week’s trends', 'Wrote a one-page summary'], result: 'Revenue up 12% this week' },
  share: { app: 'Social', steps: ['Drafted 5 posts', 'Matched your brand voice', 'Scheduled across platforms'], result: '5 posts queued for the week' },
  dollar: { app: 'Expenses', steps: ['Read 18 new receipts', 'Categorized every line', 'Synced to your books'], result: 'Books up to date' },
  check: { app: 'Leads', steps: ['12 new leads came in', 'Scored each one', 'Sent the best 3 to you'], result: '3 hot leads to call' },
  shield: { app: 'Verification', steps: ['Tomorrow’s appointments', 'Checked insurance coverage', 'Flagged one that needs attention'], result: '7 of 8 verified' },
  search: { app: 'Discovery', steps: ['Scanned 240 documents', 'Grouped them by issue', 'Summarized what matters'], result: '6 key documents found' },
  pencil: { app: 'Drafts', steps: ['Loaded your template', 'Filled in the client details', 'Highlighted terms to review'], result: 'First draft ready' },
  clipboard: { app: 'Intake', steps: ['New intake form received', 'Extracted the details', 'Created the record and routed it'], result: 'Assigned to the right person' },
  box: { app: 'Inventory', steps: ['Checked stock levels', 'Forecast next month’s demand', 'Drafted a reorder list'], result: '4 items to reorder' },
  tag: { app: 'Products', steps: ['Read the product specs', 'Wrote search-ready copy', 'Added tags and published'], result: '12 listings updated' },
  star: { app: 'Reviews', steps: ['Read 86 new reviews', 'Grouped feedback by theme', 'Summarized for your team'], result: 'Top request: faster shipping' },
}
