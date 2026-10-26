// NOTE: `isBasic` is legacy and no longer used to gate anything — all metrics
// are free. PRO gates Compare Mode, copy/export, and saving more than one
// client plan (see js/plans.js). Kept only in case a future "starter set"
// curation feature wants it.
export const METRICS_METADATA = {
  // Traffic & Video
  ad_spend: { 
    category: 'traffic', 
    label: 'Ad Spend', 
    format: 'currency', 
    tooltip: 'Total marketing budget spend', 
    isBasic: true,
    aliases: ['Budget', 'Spend']
  },
  impressions: { 
    category: 'traffic', 
    label: 'Impressions', 
    format: 'number', 
    tooltip: 'Number of times ads were loaded', 
    isBasic: true,
    aliases: ['Imps']
  },
  reach: { 
    category: 'traffic', 
    label: 'Reach', 
    format: 'number', 
    tooltip: 'Unique users who saw the ad', 
    isBasic: false,
    aliases: ['Unique Reach']
  },
  frequency: { 
    category: 'traffic', 
    label: 'Frequency', 
    format: 'float', 
    tooltip: 'Average impressions per reached user', 
    isBasic: false,
    formula: 'Impressions / Reach'
  },
  cpm: { 
    category: 'traffic', 
    label: 'CPM', 
    format: 'currency', 
    tooltip: 'Cost Per 1,000 Impressions', 
    isBasic: true,
    formula: '(Ad Spend / Impressions) * 1000'
  },
  clicks: { 
    category: 'traffic', 
    label: 'Clicks', 
    format: 'number', 
    tooltip: 'Total clicks on ad', 
    isBasic: true,
    aliases: ['Link Clicks']
  },
  ctr: { 
    category: 'traffic', 
    label: 'CTR', 
    format: 'percent', 
    tooltip: 'Click-Through Rate', 
    isBasic: true,
    formula: 'Clicks / Impressions'
  },
  cpc: { 
    category: 'traffic', 
    label: 'CPC', 
    format: 'currency', 
    tooltip: 'Cost Per Click', 
    isBasic: true,
    formula: 'Ad Spend / Clicks',
    formula_alt: 'CPM / (CTR * 1000)'
  },
  views: { 
    category: 'traffic', 
    label: 'Views', 
    format: 'number', 
    tooltip: 'Total video views', 
    isBasic: false,
    aliases: ['Video Views', 'ThruPlays']
  },
  vtr: { 
    category: 'traffic', 
    label: 'VTR', 
    format: 'percent', 
    tooltip: 'View-Through Rate', 
    isBasic: false,
    formula: 'Views / Impressions'
  },
  cpv: {
    category: 'traffic',
    label: 'CPV',
    format: 'currency',
    tooltip: 'Cost Per View',
    isBasic: false,
    formula: 'Ad Spend / Views'
  },
  
  // Lead Gen & Engagement
  engagements: { 
    category: 'leadgen', 
    label: 'Engagements', 
    format: 'number', 
    tooltip: 'Total interactions on post/ad', 
    isBasic: false,
    aliases: ['Reactions', 'Comments', 'Shares']
  },
  er: { 
    category: 'leadgen', 
    label: 'ER', 
    format: 'percent', 
    tooltip: 'Engagement Rate', 
    isBasic: false,
    formula: 'Engagements / Impressions'
  },
  cpe: { 
    category: 'leadgen', 
    label: 'CPE', 
    format: 'currency', 
    tooltip: 'Cost Per Engagement', 
    isBasic: false,
    formula: 'Ad Spend / Engagements'
  },
  installs: { 
    category: 'leadgen', 
    label: 'Installs', 
    format: 'number', 
    tooltip: 'App installs', 
    isBasic: false,
    aliases: ['App Downloads']
  },
  cpi: { 
    category: 'leadgen', 
    label: 'CPI', 
    format: 'currency', 
    tooltip: 'Cost Per Install', 
    isBasic: false,
    formula: 'Ad Spend / Installs'
  },
  leads: {
    category: 'leadgen',
    label: 'Leads',
    format: 'number',
    tooltip: 'Contacts captured',
    isBasic: true,
    aliases: ['Subscribers']
  },
  cpl: {
    category: 'leadgen',
    label: 'CPL',
    format: 'currency',
    tooltip: 'Cost Per Lead — not the same as CPA. CPA (cost per paying customer) = CPL ÷ Close Rate.',
    isBasic: true,
    formula: 'Ad Spend / Leads',
    formula_alt: 'CPC / CVR Lead'
  },
  cvr_lead: { 
    category: 'leadgen', 
    label: 'Lead CVR', 
    format: 'percent', 
    tooltip: 'Clicks to Leads conversion rate', 
    isBasic: true,
    formula: 'Leads / Clicks',
    aliases: ['CR']
  },
  mqls: { 
    category: 'leadgen', 
    label: 'MQLs', 
    format: 'number', 
    tooltip: 'Marketing Qualified Leads', 
    isBasic: false 
  },
  cvr_mql: { 
    category: 'leadgen', 
    label: 'MQL CVR', 
    format: 'percent', 
    tooltip: 'Leads to MQL rate', 
    isBasic: false,
    formula: 'MQLs / Leads'
  },
  cost_per_mql: { 
    category: 'leadgen', 
    label: 'Cost per MQL', 
    format: 'currency', 
    tooltip: 'Cost to acquire one Marketing Qualified Lead', 
    isBasic: false,
    formula: 'Ad Spend / MQLs'
  },
  sqls: { 
    category: 'leadgen', 
    label: 'SQLs', 
    format: 'number', 
    tooltip: 'Sales Qualified Leads', 
    isBasic: false 
  },
  cvr_sql: { 
    category: 'leadgen', 
    label: 'SQL CVR', 
    format: 'percent', 
    tooltip: 'MQL to SQL rate', 
    isBasic: false,
    formula: 'SQLs / MQLs'
  },
  cost_per_sql: { 
    category: 'leadgen', 
    label: 'Cost per SQL', 
    format: 'currency', 
    tooltip: 'Cost to acquire one Sales Qualified Lead', 
    isBasic: false,
    formula: 'Ad Spend / SQLs'
  },
  close_rate: { 
    category: 'leadgen', 
    label: 'Close Rate', 
    format: 'percent', 
    tooltip: 'Leads to Customer closing rate', 
    isBasic: true,
    formula: 'Customers / Leads'
  },
  target_actions: {
    category: 'leadgen',
    label: 'Target Actions',
    format: 'number',
    tooltip: 'Number of specific custom actions',
    isBasic: false,
    aliases: ['Goal Completions', 'Custom Conversions']
  },
  cost_per_action: {
    category: 'leadgen',
    label: 'Cost Per Action',
    format: 'currency',
    tooltip: 'Cost per custom micro-action (e.g. price list download) — not the same as Customer CPA (cost per paying customer).',
    isBasic: false,
    formula: 'Ad Spend / Target Actions',
    formula_alt: 'CPC / Action CVR',
    aliases: ['CPA']
  },
  cvr_action: {
    category: 'leadgen',
    label: 'Action CVR',
    format: 'percent',
    tooltip: 'Conversion rate of clicks to target actions',
    isBasic: false,
    formula: 'Target Actions / Clicks'
  },
  cvr_action_to_lead: {
    category: 'leadgen',
    label: 'Action-to-Lead CVR',
    format: 'percent',
    tooltip: 'Conversion rate of target actions to leads',
    isBasic: false,
    formula: 'Leads / Target Actions'
  },

  // E-Commerce
  purchases: {
    category: 'ecom',
    label: 'Purchases',
    format: 'number',
    tooltip: 'Completed sales. This calculator treats one purchase as one customer — it doesn\'t separately track repeat buyers.',
    isBasic: true,
    aliases: ['Orders', 'Sales', 'Transactions', 'Customers']
  },
  cpo: { 
    category: 'ecom', 
    label: 'CPO', 
    format: 'currency', 
    tooltip: 'Cost Per Order', 
    isBasic: true,
    formula: 'Ad Spend / Purchases',
    formula_alt: 'CPC / CVR',
    aliases: ['CPP'],
    equals: ['CPA', 'CAC']
  },
  aov: { 
    category: 'ecom', 
    label: 'AOV', 
    format: 'currency', 
    tooltip: 'Average Order Value', 
    isBasic: true,
    formula: 'Revenue / Purchases',
    aliases: ['Average Order Value']
  },
  revenue: { 
    category: 'ecom', 
    label: 'Revenue', 
    format: 'currency', 
    tooltip: 'Gross Campaign Revenue', 
    isBasic: true,
    aliases: ['Sales Value', 'Turnover']
  },
  atc: { 
    category: 'ecom', 
    label: 'Add to Cart', 
    format: 'number', 
    tooltip: 'Total Add to Carts', 
    isBasic: false,
    aliases: ['ATC']
  },
  atc_rate: { 
    category: 'ecom', 
    label: 'ATC Rate', 
    format: 'percent', 
    tooltip: 'Conversion rate of clicks to add to carts', 
    isBasic: false,
    formula: 'ATC / Clicks'
  },
  checkout: { 
    category: 'ecom', 
    label: 'Checkouts', 
    format: 'number', 
    tooltip: 'Total checkouts initiated', 
    isBasic: false,
    aliases: ['Initiated Checkout']
  },
  checkout_rate: { 
    category: 'ecom', 
    label: 'Checkout Rate', 
    format: 'percent', 
    tooltip: 'Conversion rate of clicks to checkouts', 
    isBasic: false,
    formula: 'Checkouts / Clicks'
  },
  cvr: { 
    category: 'ecom', 
    label: 'CVR', 
    format: 'percent', 
    tooltip: 'Click-to-Purchase Conversion Rate', 
    isBasic: true,
    formula: 'Purchases / Clicks',
    aliases: ['CR', 'E-com CVR']
  },

  // SaaS & Subscriptions
  signups: { 
    category: 'saas', 
    label: 'Signups', 
    format: 'number', 
    tooltip: 'Registered users', 
    isBasic: true,
    aliases: ['Registrations']
  },
  cvr_signup: { 
    category: 'saas', 
    label: 'Signup CVR', 
    format: 'percent', 
    tooltip: 'Clicks to Signup rate', 
    isBasic: true,
    formula: 'Signups / Clicks'
  },
  cps: { 
    category: 'saas', 
    label: 'CPS', 
    format: 'currency', 
    tooltip: 'Cost Per Signup', 
    isBasic: false,
    formula: 'Ad Spend / Signups',
    aliases: ['Cost Per Signup']
  },
  trials: { 
    category: 'saas', 
    label: 'Trials', 
    format: 'number', 
    tooltip: 'Active trials', 
    isBasic: false,
    aliases: ['Free Trials']
  },
  cvr_trial: { 
    category: 'saas', 
    label: 'Trial CVR', 
    format: 'percent', 
    tooltip: 'Signups to Trial rate', 
    isBasic: false,
    formula: 'Trials / Signups'
  },
  cpt: { 
    category: 'saas', 
    label: 'CPT', 
    format: 'currency', 
    tooltip: 'Cost Per Trial', 
    isBasic: false,
    formula: 'Ad Spend / Trials',
    aliases: ['Cost Per Trial']
  },
  cvr_trial_purchase: { 
    category: 'saas', 
    label: 'Trial-to-Purchase CVR', 
    format: 'percent', 
    tooltip: 'Trials to Customer conversion rate', 
    isBasic: false,
    formula: 'Customers / Trials'
  },
  mrr: {
    category: 'saas',
    label: 'MRR',
    format: 'currency',
    tooltip: 'New Monthly Recurring Revenue added this period (new paying customers × price) — not your company-wide total MRR across all existing subscribers.',
    isBasic: false,
    formula: 'Purchases × AOV'
  },
  arr: { 
    category: 'saas', 
    label: 'ARR', 
    format: 'currency', 
    tooltip: 'Annual Recurring Revenue', 
    isBasic: false,
    formula: 'MRR * 12'
  },
  cac_payback: {
    category: 'saas',
    label: 'CAC Payback (mo)',
    format: 'float',
    tooltip: 'Months to earn back what you spent acquiring a customer. Approximates monthly profit per user as AOV × Gross Margin — enter AOV as your average monthly value per customer for this to be accurate.',
    isBasic: false,
    formula: 'CAC / Monthly Gross Profit per User'
  },
  churn_rate: { 
    category: 'saas', 
    label: 'Churn Rate', 
    format: 'percent', 
    tooltip: 'Monthly client churn rate', 
    isBasic: false,
    formula: 'Lost Customers / Total Customers'
  },
  ltv_cac_ratio: {
    category: 'saas',
    label: 'LTV:CAC',
    format: 'float',
    tooltip: 'Lifetime Value to Customer Acquisition Cost ratio',
    isBasic: false,
    formula: 'LTV / CAC'
  },

  // Shared & Cross-Domain
  cpa: {
    category: 'shared',
    label: 'Customer CPA',
    format: 'currency',
    tooltip: 'Cost to acquire one paying customer — not the same as "cost per action". Always ≥ CPL, since not every lead converts.',
    isBasic: false,
    formula: 'Ad Spend / Customers',
    formula_alt: 'CPC / CVR',
    aliases: ['CAC'],
    equals: ['CPO', 'CAC']
  },
  cac: { 
    category: 'shared', 
    label: 'CAC', 
    format: 'currency', 
    tooltip: 'Total ad spend divided by new customers acquired', 
    isBasic: false,
    formula: 'Ad Spend / Customers',
    equals: ['CPA', 'CPO']
  },
  roas: { 
    category: 'shared', 
    label: 'ROAS', 
    format: 'float', 
    tooltip: 'Return on Ad Spend', 
    isBasic: true,
    formula: 'Revenue / Ad Spend',
    equals: ['MER']
  },
  mer: { 
    category: 'shared', 
    label: 'MER', 
    format: 'float', 
    tooltip: 'Marketing Efficiency Ratio', 
    isBasic: false,
    formula: 'Total Revenue / Total Ad Spend',
    aliases: ['Blended ROAS', 'Eco-ROAS'],
    equals: ['ROAS']
  },
  drr: {
    category: 'shared',
    label: 'DRR',
    format: 'percent',
    tooltip: 'Ad spend as a percentage of revenue (inverse of ROAS)',
    isBasic: false,
    formula: 'Ad Spend / Revenue',
    aliases: ['ACOS', 'A/S Ratio']
  },

  // Profitability
  cogs: {
    category: 'profit',
    label: 'COGS',
    format: 'currency',
    tooltip: 'Cost of Goods Sold — what it cost you to produce or source what you sold. Enter this instead of Gross Margin % and the calculator derives the margin for you.',
    isBasic: true,
    aliases: ['Cost of Goods Sold']
  },
  gross_margin: {
    category: 'profit',
    label: 'Gross Margin',
    format: 'percent',
    tooltip: 'Gross profit as a percentage of revenue',
    isBasic: true,
    formula: '(Revenue - COGS) / Revenue'
  },
  gross_profit: { 
    category: 'profit', 
    label: 'Gross Profit', 
    format: 'currency', 
    tooltip: 'Revenue minus cost of goods sold (before ad spend)', 
    isBasic: true,
    formula: 'Revenue × Gross Margin'
  },
  net_profit: { 
    category: 'profit', 
    label: 'Net Profit', 
    format: 'currency', 
    tooltip: 'Net marketing profit', 
    isBasic: true,
    formula: 'Gross Profit - Ad Spend',
    equals: ['Contribution Margin']
  },
  contribution_margin: {
    category: 'profit',
    label: 'Contrib. Margin',
    format: 'currency',
    tooltip: 'Profit remaining after ad spend is subtracted from gross profit',
    isBasic: true,
    aliases: ['Contribution Margin'],
    equals: ['Net Profit']
  },
  net_margin: { 
    category: 'profit', 
    label: 'Net Margin', 
    format: 'percent', 
    tooltip: 'Net marketing profit as a percentage of revenue', 
    isBasic: true,
    formula: 'Net Profit / Revenue'
  },
  poas: { 
    category: 'profit', 
    label: 'POAS', 
    format: 'float', 
    tooltip: 'Gross profit generated per unit of ad spend', 
    isBasic: true,
    formula: 'Gross Profit / Ad Spend'
  },
  romi: { 
    category: 'profit', 
    label: 'ROMI', 
    format: 'percent', 
    tooltip: 'Return on marketing investment (Net Profit / Ad Spend)', 
    isBasic: true,
    formula: 'Net Profit / Ad Spend',
    equals: ['ROI']
  },
  roi: {
    category: 'profit',
    label: 'ROI',
    format: 'percent',
    tooltip: 'Return on Investment (Net Profit / Ad Spend)',
    isBasic: true,
    formula: 'Net Profit / Ad Spend',
    equals: ['ROMI']
  },
  break_even_roas: {
    category: 'profit',
    label: 'Break-Even ROAS',
    format: 'float',
    tooltip: 'The minimum ROAS needed to not lose money on this spend, given your margin. Below this number, you\'re paying to lose.',
    isBasic: true,
    formula: '1 / Gross Margin'
  },
  ltv: {
    category: 'profit', 
    label: 'LTV', 
    format: 'currency', 
    tooltip: 'Lifetime Value of a customer', 
    isBasic: false,
    aliases: ['CLV', 'CLTV']
  },
  // Omnichannel & Offline
  store_visits: {
    category: 'offline',
    label: 'Store Visits',
    format: 'number',
    tooltip: 'Number of store visits generated',
    isBasic: true,
    aliases: ['Visits', 'Foot Traffic']
  },
  cvr_visit: {
    category: 'offline',
    label: 'Visit Rate',
    format: 'percent',
    tooltip: 'Clicks to Store Visits rate',
    isBasic: true,
    formula: 'Store Visits / Clicks'
  },
  cost_per_visit: {
    category: 'offline',
    label: 'Cost Per Visit',
    format: 'currency',
    tooltip: 'Ad Spend divided by Store Visits — not the same as CPV (Cost Per View) in the Traffic section.',
    isBasic: false,
    formula: 'Ad Spend / Store Visits'
  },
  in_store_cvr: {
    category: 'offline',
    label: 'In-Store CVR',
    format: 'percent',
    tooltip: 'Store Visits to Purchases rate',
    isBasic: false,
    formula: 'Purchases / Store Visits'
  },
  calls: {
    category: 'offline',
    label: 'Calls',
    format: 'number',
    tooltip: 'Number of phone calls generated',
    isBasic: true,
    aliases: ['Phone Calls']
  },
  cvr_call: {
    category: 'offline',
    label: 'Call Rate',
    format: 'percent',
    tooltip: 'Clicks to Calls rate',
    isBasic: true,
    formula: 'Calls / Clicks'
  },
  cost_per_call: {
    category: 'offline',
    label: 'Cost Per Call',
    format: 'currency',
    tooltip: 'Ad Spend divided by Calls',
    isBasic: false,
    formula: 'Ad Spend / Calls'
  },
  cvr_call_to_purchase: {
    category: 'offline',
    label: 'Call-to-Order CVR',
    format: 'percent',
    tooltip: 'Conversion rate from phone calls to orders',
    isBasic: false,
    formula: 'Purchases / Calls'
  },
  appointments: {
    category: 'offline',
    label: 'Bookings',
    format: 'number',
    tooltip: 'Number of booked appointments or visits',
    isBasic: false,
    aliases: ['Appointments', 'Reservations']
  },
  cvr_appointment: {
    category: 'offline',
    label: 'Booking Rate',
    format: 'percent',
    tooltip: 'Calls to Appointments conversion rate',
    isBasic: false,
    formula: 'Appointments / Calls'
  }
};
