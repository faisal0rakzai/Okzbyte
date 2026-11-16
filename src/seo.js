export const SITE_ORIGIN = 'https://okzbyte.vercel.app';
export const DEFAULT_SOCIAL_IMAGE = `${SITE_ORIGIN}/og-cover.svg`;

/** @type {Record<string, [string, string, string]>} */
const pages = {
  '/': ['OkzByte — Engineering Intelligence', 'OkzByte builds intelligent technologies, decentralized systems and digital infrastructure for the next generation of innovation.', 'Engineering Intelligence. Building the Digital Future.'],
  '/about': ['About OkzByte — Engineering Digital Intelligence', 'Discover OkzByte’s story, mission, technology fields, principles, ecosystem initiatives, and founder.', 'Engineering the Future of Digital Intelligence.'],
  '/technologies': ['Technologies | AI, Blockchain, Web3 & Digital Infrastructure | OkzByte', 'Explore OkzByte’s technology domains, including artificial intelligence, blockchain, Web3, fintech, real-world assets, cloud infrastructure, data engineering and emerging digital systems.', 'Engineering the Technologies That Shape Tomorrow.'],
  '/solutions': ['Technology Solutions | AI, Blockchain, Software & Cloud | OkzByte', 'Discover OkzByte technology solutions across AI, blockchain, Web3, fintech, enterprise software, web and mobile applications, cloud infrastructure and business automation.', 'Technology Solutions. Engineered for What’s Next.'],
  '/products': ['Products & Platforms — OkzByte', 'Product thinking and technology foundations for ambitious digital experiences.', 'Products and Platforms at OkzByte.'],
  '/ai-workspace': ['OkzByte AI Workspace | Agents, Automation & Governance', 'Explore OkzByte AI Workspace concepts for AI agents, workflow orchestration, integrations and enterprise automation governance.', 'AI Workspace for Connected Automation.'],
  '/workspace': ['AI Workspace Dashboard | OkzByte', 'Private OkzByte workspace dashboard for authorized users.', 'AI Workspace Dashboard.'],
  '/workspace/agents': ['AI Agents | OkzByte Workspace', 'Private agent management for authorized OkzByte workspace users.', 'AI Agents.'],
  '/workspace/agents/create': ['Agent Builder | OkzByte AI Workspace', 'Private agent configuration for authorized OkzByte workspace users.', 'Create an AI Agent.'],
  '/workspace/workflows': ['Workflow Automation Builder | OkzByte', 'Private workflow automation tools for authorized OkzByte workspace users.', 'Workflow Automation.'],
  '/workspace/models': ['AI Model Providers | OkzByte Workspace', 'Private model-provider settings for authorized OkzByte workspace users.', 'AI Model Providers.'],
  '/workspace/playground': ['Agent Playground | OkzByte Workspace', 'Private agent testing tools for authorized OkzByte workspace users.', 'Agent Playground.'],
  '/workspace/knowledge': ['Knowledge Bases | OkzByte Workspace', 'Private knowledge-base tools for authorized OkzByte workspace users.', 'Knowledge Bases.'],
  '/workspace/integrations': ['Integrations | OkzByte Workspace', 'Private integration settings for authorized OkzByte workspace users.', 'Workspace Integrations.'],
  '/workspace/approvals': ['Approvals | OkzByte Workspace', 'Private workflow approvals for authorized OkzByte workspace users.', 'Human Approvals.'],
  '/workspace/governance': ['AI Governance | OkzByte Workspace', 'Private AI governance controls for authorized OkzByte workspace users.', 'AI Governance.'],
  '/billing': ['OkzByte Billing Center | Payments, Invoices & Subscriptions', 'Private billing and payment records for authorized OkzByte users.', 'Billing Center.'],
  '/billing/preferences': ['Billing Preferences | OkzByte', 'Private billing preferences for authorized OkzByte users.', 'Billing Preferences.'],
  '/billing/invoices': ['Billing Invoices | OkzByte', 'Private invoices for authorized OkzByte users.', 'Billing Invoices.'],
  '/billing/transactions': ['Transaction History | OkzByte', 'Private transaction history for authorized OkzByte users.', 'Transaction History.'],
  '/billing/refunds': ['Refund Requests | OkzByte', 'Private refund requests for authorized OkzByte users.', 'Refund Requests.'],
  '/checkout': ['Secure Checkout | OkzByte Billing', 'Private checkout flow for authorized OkzByte customers.', 'Secure Checkout.'],
  '/subscriptions': ['Subscriptions | OkzByte', 'Private subscription management for authorized OkzByte users.', 'Subscriptions.'],
  '/subscriptions/manage': ['Manage Subscription | OkzByte', 'Private subscription management for authorized OkzByte users.', 'Manage Subscription.'],
  '/subscriptions/plans': ['Subscription Plans | OkzByte', 'Explore OkzByte subscription plan structures. Pricing and recurring billing activate only after authorized configuration.', 'Subscription Plans.'],
  '/enterprise': ['OkzByte Enterprise | Business Solutions & Technology Consulting', 'Technology solutions, enterprise software, intelligent automation, blockchain infrastructure, and digital transformation capabilities from OkzByte.', 'Technology That Moves Business Forward.'],
  '/enterprise/solutions': ['Business Solutions | OkzByte Enterprise', 'Explore OkzByte enterprise capabilities across AI, Web3, fintech, enterprise software, cloud infrastructure, cybersecurity and data engineering.', 'Business Solutions.'],
  '/enterprise/industries': ['Industry Solutions | OkzByte Enterprise', 'Explore technology capability hypotheses shaped around the operational context of financial services, property, retail, SaaS and other industries.', 'Solutions Shaped by Context.'],
  '/enterprise/services': ['Enterprise Technology Services | OkzByte', 'Review OkzByte enterprise capability areas and their delivery boundaries across software, AI, blockchain, cloud and data.', 'Services with Clear Boundaries.'],
  '/enterprise/case-studies': ['Enterprise Case Studies | OkzByte', 'OkzByte publishes case studies only after project approval and outcome verification. No approved case studies are currently presented on this page.', 'Proof Before Promotion.'],
  '/enterprise/request-project': ['Request a Project | OkzByte Enterprise', 'Share your organization’s objectives, requirements and project context with OkzByte for an initial review.', 'Discuss Your Project.'],
  '/enterprise/consultation': ['Business Consultation | OkzByte Enterprise', 'Request a business consultation with OkzByte. Meeting requests are subject to confirmation.', 'Book a Business Consultation.'],
  '/portal': ['OkzByte Client Portal | Secure Business Workspace', 'Private client workspace entry for authorized OkzByte business engagements.', 'OkzByte Client Portal.'],
  '/admin': ['OkzByte Administration | Staff Login', 'Private OkzByte staff administration. Access requires authorization.', 'Staff Administration.'],
  '/security/admin': ['Security Administration | OkzByte', 'Private security administration for authorized OkzByte staff.', 'Security Status Dashboard.'],
  '/security': ['OkzByte Security & Trust Center | Security, Privacy & Transparency', 'Explore OkzByte’s security practices, data protection approach, blockchain security principles, responsible disclosure and technology transparency.', 'Security Is Built Into Every Layer.'],
  '/security/overview': ['Security Overview | OkzByte Security & Trust Center', 'Evidence-bounded overview of OkzByte application, infrastructure, data, access, API and response controls.', 'Security Overview.'],
  '/security/application-security': ['Application Security | OkzByte Security Center', 'Review OkzByte application security controls and the evidence boundaries for code, forms, sessions and administrative surfaces.', 'Application Security.'],
  '/security/infrastructure': ['Infrastructure Security | OkzByte Security Center', 'Review evidence and open verification items for OkzByte hosting, transport, deployment, network boundaries and recovery.', 'Infrastructure & Network Security.'],
  '/security/data-protection': ['Data Protection & Privacy | OkzByte Security Center', 'Review OkzByte data protection practices, privacy request handling, retention boundaries and evidence still requiring confirmation.', 'Data Protection & Privacy.'],
  '/security/identity-access': ['Identity & Access Management | OkzByte Security Center', 'Review OkzByte identity, administrator access, session and authorization controls with explicit verification boundaries.', 'Identity & Access Security.'],
  '/security/smart-contracts': ['Smart Contract Security | OkzByte Security Center', 'Review the scope and evidence requirements for smart-contract architecture, permissions, upgrades and ecosystem references.', 'Blockchain & Smart Contract Security.'],
  '/security/api-security': ['API Security | OkzByte Security Center', 'Review OkzByte API validation, rate limiting, permissions and secrets-handling guidance.', 'API & Developer Security.'],
  '/security/vulnerability-disclosure': ['Responsible Vulnerability Disclosure | OkzByte', 'Privately report suspected OkzByte vulnerabilities and review responsible disclosure guidance.', 'Help Us Make Technology Safer.'],
  '/security/incident-response': ['Incident Response | OkzByte Security Center', 'Review OkzByte incident response lifecycle guidance and operational evidence boundaries.', 'Security Incident Response.'],
  '/security/trust': ['Trust & Compliance Center | OkzByte', 'Review OkzByte trust and compliance topics without implying unverified certifications or audit claims.', 'Trust & Compliance Center.'],
  '/security/documentation': ['Security Documentation | OkzByte', 'Review versioned OkzByte security documentation and distinguish drafts from verified evidence.', 'Security Documentation.'],
  '/developers/api': ['API Security | OkzByte Developers', 'Secure API usage guidance, validation, rate limiting, permissions and secrets handling for OkzByte developers.', 'API & Developer Security.'],
  '/developers': ['OkzByte Developers | APIs, Tools & Digital Infrastructure', 'Developer resources for building intelligent software, connected systems and decentralized infrastructure with OkzByte.', 'Build What’s Next.'],
  '/research': ['OkzByte Research | AI, Blockchain, Technology & Digital Infrastructure', 'Explore OkzByte Research for technical papers, original research, analysis and insights across AI, blockchain, fintech, Web3 and emerging technologies.', 'Research Across Systems and Infrastructure.'],
  '/research/profile': ['Faisal Orakzai | Researcher Profile | OkzByte', 'Explore the researcher profile, research interests and verified public research links for Faisal Orakzai.', 'Faisal Orakzai — Researcher Profile.'],
  '/ecosystem': ['OkzByte Ecosystem | AI, Blockchain, Digital Platforms & Ventures', 'Explore the OkzByte and Orakzai ecosystem of technology initiatives, AI research, blockchain platforms and digital technology.', 'One Vision. Multiple Ventures. A Connected Digital Future.'],
  '/careers': ['Careers at OkzByte | Build the Future of Technology', 'Join OkzByte as we explore artificial intelligence, blockchain, digital infrastructure and next-generation technology.', 'Build What Comes Next.'],
  '/contact': ['Contact OkzByte | Business, Support & Partnerships', 'Contact OkzByte about business inquiries, enterprise solutions, partnerships, support and media.', 'Let’s Build Something Together.'],
  '/support': ['OkzByte Support Center', 'Find verified support information, browse FAQs, submit a support ticket or track an existing request.', 'OkzByte Support Center.'],
  '/support/faq': ['Support FAQs | OkzByte', 'Answers about contacting OkzByte, technical support, partnerships, careers, privacy and ticket tracking.', 'Answers, with Clarity.'],
  '/support/ticket': ['Submit a Support Ticket | OkzByte', 'Send a support request to OkzByte and receive a unique ticket reference.', 'Tell Us What Happened.'],
  '/support/track': ['Track a Support Ticket | OkzByte', 'Securely check an OkzByte support ticket using its reference and registered email address.', 'Track Your Support Ticket.'],
  '/privacy': ['Privacy Policy & Data Protection Center — OkzByte', 'Read the OkzByte privacy policy, data practices, privacy rights and contact details.', 'Your Privacy. Our Responsibility.'],
  '/terms': ['Terms of Service — OkzByte Technology', 'Terms governing the OkzByte Technology website, technology information, research and associated resources.', 'Terms for a Clear Relationship.'],
  '/terms-and-conditions': ['Terms of Service — OkzByte Technology', 'Terms governing the OkzByte Technology website, technology information, research and associated resources.', 'Terms for a Clear Relationship.'],
};

/** @type {Record<string, [string, string, string]>} */
const solutionSlugs = {
  'ai-automation': ['Artificial Intelligence & Automation', 'Business AI & Automation Solutions | OkzByte', 'Explore AI agents, intelligent workflows, enterprise automation and custom AI integrations from OkzByte.'],
  'blockchain-web3': ['Blockchain & Web3', 'Blockchain & Web3 Solutions | OkzByte', 'Explore blockchain applications, smart contract engineering, decentralized architecture and tokenization infrastructure.'],
  'fintech-digital-finance': ['Fintech & Digital Finance', 'Fintech & Digital Finance Solutions | OkzByte', 'Explore digital finance platforms, payment integrations and financial workflow technology capabilities.'],
  'rwa-proptech': ['Real-World Assets & PropTech', 'RWA Tokenization & PropTech Solutions | OkzByte', 'Explore digital asset infrastructure, property technology and programmable ownership capabilities.'],
  'enterprise-software': ['Enterprise Software & Platforms', 'Enterprise Software Development | OkzByte', 'Explore custom business software, SaaS platforms, enterprise dashboards and workflow systems.'],
  'cloud-infrastructure': ['Cloud & Digital Infrastructure', 'Cloud & Digital Infrastructure Solutions | OkzByte', 'Explore cloud architecture, deployment workflows, backend systems and infrastructure integrations.'],
  'cybersecurity-trust': ['Cybersecurity & Digital Trust', 'Cybersecurity & Digital Trust Solutions | OkzByte', 'Explore application security, access management and secure API architecture capabilities.'],
  'data-analytics': ['Data Engineering & Analytics', 'Data Engineering & Analytics Solutions | OkzByte', 'Explore data pipelines, business intelligence, data infrastructure and analytics integrations.'],
};
/** @type {Record<string, string>} */
const industrySlugs = {
  'financial-services': 'Financial Services',
  'real-estate-property': 'Real Estate & Property',
  'retail-ecommerce': 'Retail & E-Commerce',
  'technology-saas': 'Technology & SaaS',
  'logistics-transportation': 'Logistics & Transportation',
  education: 'Education',
  'healthcare-technology': 'Healthcare Technology',
  'government-public-services': 'Government & Public Services',
  'manufacturing-industrial': 'Manufacturing & Industrial Technology',
};

const securityPaths = new Set([
  '/security', '/security/overview', '/security/application-security', '/security/infrastructure',
  '/security/data-protection', '/security/identity-access', '/security/smart-contracts',
  '/security/api-security', '/security/vulnerability-disclosure', '/security/incident-response',
  '/security/trust', '/security/documentation', '/security/admin',
]);

const appExactPaths = new Set([
  ...Object.keys(pages), '/enterprise/industries', '/enterprise/services', '/enterprise/case-studies',
  '/enterprise/request-project', '/enterprise/consultation', '/admin', '/admin/enterprise',
  '/admin/ai-workspace', '/admin/billing', '/research/profile',
  '/workspace/orchestration', '/workspace/memory', '/workspace/api', '/workspace/usage',
  '/workspace/monitoring', '/workspace/settings', '/portal/dashboard', '/portal/projects', '/portal/billing/payment-methods',
  '/portal/proposals', '/portal/documents', '/portal/support', '/portal/settings',
  '/billing/promotions', '/billing/disputes', '/billing/settings', '/admin/billing/gateways',
  '/admin/billing/subscriptions', '/admin/billing/refunds', '/admin/billing/promotions',
  '/admin/billing/disputes', '/admin/billing/settings', '/admin/enterprise',
]);

export const PRIVATE_ROUTE_PREFIXES = ['/admin', '/workspace', '/portal', '/billing', '/checkout', '/subscriptions/manage', '/subscriptions'];

/** @param {string} pathname */
export function isPrivateRoute(pathname) {
  const path = normalizePath(pathname);
  if (path === '/subscriptions/plans') return false;
  return PRIVATE_ROUTE_PREFIXES.some(prefix => path === prefix || path.startsWith(`${prefix}/`))
    || path === '/security/admin'
    || path === '/support/track'
    || path === '/enterprise/case-studies';
}

/** @param {string} pathname */
function normalizePath(pathname) {
  const path = String(pathname || '/').split('?')[0].split('#')[0];
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, '') : '/';
}

/** @param {string} pathname */
export function getPageSEO(pathname) {
  const path = normalizePath(pathname);
  let page = pages[path];
  if (!page && path.startsWith('/research/') && path.split('/').filter(Boolean).length === 2) {
    page = pages['/research'];
  }
  if (!page && path.startsWith('/enterprise/solutions/')) {
    const detail = solutionSlugs[path.split('/').pop() || ''];
    if (detail) page = [detail[1], detail[2], detail[0]];
  }
  if (!page && path.startsWith('/enterprise/industries/')) {
    const name = industrySlugs[path.split('/').pop() || ''];
    if (name) page = [`${name} Technology Solutions | OkzByte`, `Explore technology capabilities and potential architecture considerations for the ${name} sector.`, name];
  }
  if (!page && path === '/enterprise/industries') page = ['Industry Solutions | OkzByte Enterprise', 'Explore technology capability hypotheses shaped around the operational context of multiple industries.', 'Solutions Shaped by Context.'];
  if (!page && securityPaths.has(path)) page = pages[path] || ['Security Administration | OkzByte', 'Private security administration for authorized OkzByte staff.', 'Security Status Dashboard.'];
  if (!page && isPrivateRoute(path)) {
    const label = path.split('/').filter(Boolean).at(-1)?.replace(/[-_]/g, ' ') || 'Account';
    const title = label.replace(/\b\w/g, letter => letter.toUpperCase());
    page = [`${title} | OkzByte`, `Private ${label} page for authorized OkzByte users.`, `${title}.`];
  }
  if (!page) {
    return { path, title: 'Page Not Found | OkzByte', description: 'The requested OkzByte page could not be found.', h1: 'This page could not be found.', canonical: null, robots: 'noindex,follow', exists: false, indexable: false };
  }
  const canonicalPath = path === '/terms' ? '/terms-and-conditions' : path;
  const indexable = !isPrivateRoute(path);
  return {
    path,
    title: page[0],
    description: page[1],
    h1: page[2],
    canonical: `${SITE_ORIGIN}${canonicalPath === '/' ? '/' : canonicalPath}`,
    robots: indexable ? 'index,follow' : 'noindex,follow',
    exists: true,
    indexable,
  };
}

/** @param {string} pathname */
export function isKnownAppPath(pathname) {
  const path = normalizePath(pathname);
  if (appExactPaths.has(path) || securityPaths.has(path)) return true;
  if (path.startsWith('/research/') && path.split('/').filter(Boolean).length === 2) return true;
  if (path.startsWith('/enterprise/solutions/')) return Boolean(solutionSlugs[path.split('/').pop() || '']);
  if (path.startsWith('/enterprise/industries/')) return Boolean(industrySlugs[path.split('/').pop() || '']);
  if (path.startsWith('/workspace/agents/') && path.split('/').filter(Boolean).length === 3) return true;
  if (path.startsWith('/workspace/workflows/') && path.split('/').filter(Boolean).length === 3) return true;
  if (path.startsWith('/billing/invoices/') && path.split('/').filter(Boolean).length === 3) return true;
  if (path.startsWith('/portal/projects/') && path.split('/').filter(Boolean).length === 3) return true;
  return false;
}

export const SITEMAP_PATHS = [
  '/', '/about', '/technologies', '/solutions', '/products', '/ai-workspace',
  '/research', '/research/profile', '/enterprise', '/enterprise/solutions',
  '/enterprise/industries', '/enterprise/services', '/enterprise/request-project',
  '/enterprise/consultation',
  ...Object.keys(solutionSlugs).map(slug => `/enterprise/solutions/${slug}`),
  ...Object.keys(industrySlugs).map(slug => `/enterprise/industries/${slug}`),
  '/security', '/security/overview', '/security/application-security', '/security/infrastructure',
  '/security/data-protection', '/security/identity-access', '/security/smart-contracts',
  '/security/api-security', '/security/vulnerability-disclosure', '/security/incident-response',
  '/security/trust', '/security/documentation', '/developers', '/developers/api',
  '/ecosystem', '/careers', '/contact', '/support', '/support/faq', '/support/ticket',
  '/privacy', '/terms-and-conditions',
];
