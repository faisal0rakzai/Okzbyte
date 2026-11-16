import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, ChevronDown, Search, ShieldCheck } from 'lucide-react';
import './terms.css';

const termsSections = [
  {
    id: 'acceptance', title: 'Acceptance of Terms', search: 'agreement acceptance use website applicable product terms changes',
    body: <><p>These Terms and Conditions govern access to and use of the OkzByte website, digital platforms, services and associated resources. By accessing or using the website or a service to which these Terms apply, you agree to the terms that apply to your use. If you do not agree, do not use the applicable website or service.</p><p>Specific products or services may have additional terms, an order form, license, statement of work, or other agreement. Those additional terms apply to that product or service when presented and accepted. If they conflict with these general Terms, the product-specific agreement controls only for the conflict and only for the applicable service.</p><p>We may communicate changes by updating this page and its “Last updated” date. Where the law requires advance notice or a different method, we will follow that requirement. Continued use after an update takes effect may constitute acceptance only to the extent allowed by applicable law.</p></>
  },
  {
    id: 'about-okzbyte', title: 'About OkzByte', search: 'legal name business operator contact company registration address jurisdiction',
    body: <><p>The website is presented under the name <strong>OkzByte Technology</strong> (also referred to as “OkzByte,” “we,” or “us”), as supplied by the site owner. The website does not currently provide a verified registration number, legal form, registered address, or governing jurisdiction. Naming the operator here does not assert that any particular incorporation, license, or registration has been verified.</p><p>The site describes OkzByte as a technology venture and presents information about software, research, artificial intelligence, blockchain and digital infrastructure. A description of a technology area is not, by itself, an offer to provide a commercial product or a statement that a product is currently available.</p></>
  },
  {
    id: 'eligibility', title: 'Eligibility and User Responsibilities', search: 'eligibility age legal capacity businesses organizations authority underage',
    body: <><p>You may use the site only if you can lawfully do so and have the legal capacity required where you live. We do not set an arbitrary minimum age in these general website Terms. The site is not designed for children to submit personal information; see the <a href="/privacy#children">Privacy Policy</a>.</p><p>If you use a service for a company or other organization, you represent that you are authorized to act for it. You are responsible for information you submit, complying with applicable laws, and ensuring your use does not infringe another person's rights. Review any product-specific terms before using a separate service.</p></>
  },
  {
    id: 'access', title: 'Website Access and Availability', search: 'website access availability changes maintenance interruptions uptime service',
    body: <><p>We aim to keep the website useful and secure, but we do not promise uninterrupted availability, error-free operation, or a particular response time. Access may be unavailable or limited for maintenance, upgrades, security, legal reasons, or circumstances beyond our reasonable control. We may add, change, suspend, or discontinue website features, subject to applicable law and any separate written agreement.</p><p>These Terms do not create a service-level agreement, uptime commitment, support obligation, or guaranteed delivery date.</p></>
  },
  {
    id: 'accounts', title: 'User Accounts and Security', search: 'accounts registration credentials password security suspension deletion',
    body: <><p>The reviewed public website does not currently offer general user-account registration or a public account sign-in service. Do not treat the private administrator interface as a public account product. If OkzByte later offers user accounts, the applicable registration, security, deletion, and account-specific rules will be provided before or when that feature is enabled.</p><p>If a future service provides credentials, keep them confidential, use the service only through authorized access, and promptly report suspected compromise through the contact details below. We may restrict access to respond to security threats or serious misuse, subject to applicable law and the terms of that service.</p></>
  },
  {
    id: 'technology-services', title: 'Products and Technology Services', search: 'products services AI machine learning blockchain fintech software cloud cyber security data identity R&D',
    body: <><p>OkzByte's site describes work and areas of interest that include artificial intelligence and machine learning, blockchain and Web3, decentralized-finance concepts, fintech, real-world-asset technology, software engineering, cloud infrastructure, cybersecurity, data engineering, digital identity, and research and development.</p><p>These descriptions are informational. They do not mean every item is a launched, generally available, supported, or purchasable product. Availability, specifications, eligibility, fees, support, service levels, and permitted uses may differ by offering and will be described in product-specific documentation or a separate agreement where applicable. Do not rely on a general site description as a product specification.</p></>
  },
  {
    id: 'ai', title: 'AI Tools and Outputs', search: 'AI artificial intelligence machine learning output hallucinations accuracy advice responsibility',
    body: <><p>Where an OkzByte product or service uses artificial intelligence or machine learning, its outputs may be inaccurate, incomplete, outdated, biased, or unsuitable for a particular purpose. AI output may require independent checking and human review. Do not rely on it as legal, financial, tax, medical, safety, employment, or other professional advice, or as the sole basis for a consequential decision.</p><p>You remain responsible for evaluating and using any output. Do not use AI tools for unlawful, harmful, deceptive, or unauthorized activity, or to violate another person's rights. Data submitted to an AI feature is handled under the applicable Privacy Policy and any product-specific terms. The public website itself does not establish that a production AI tool is available or that any output is guaranteed.</p></>
  },
  {
    id: 'blockchain', title: 'Blockchain and Web3 Services', search: 'blockchain web3 smart contracts network congestion transaction delays irreversible wallets keys fees vulnerabilities protocols upgrades',
    body: <><p>Blockchain networks, smart contracts, wallets, and decentralized protocols may be operated by third parties and may change without OkzByte's control. Transactions may be delayed, fail, become difficult or impossible to reverse, or be affected by network congestion, software defects, protocol upgrades, forks, outages, attacks, third-party infrastructure, or changing rules.</p><p>Users are responsible for securing their own wallets, devices, credentials, and private keys. A lost or compromised private key may result in permanent loss of access. Network fees may apply and may change independently of OkzByte. Smart contracts and software can contain vulnerabilities; no general website statement guarantees that code is error-free, audited, or secure.</p><p>The site does not state that a blockchain service, exchange, wallet, custodian, or protocol is currently offered by OkzByte. Any such service would require its own terms and disclosures.</p></>
  },
  {
    id: 'digital-assets', title: 'Digital Assets and Financial Risk', search: 'digital assets volatility loss investment returns financial investment tax legal advice risk',
    body: <><p>Digital assets and blockchain participation can involve substantial technical, legal, liquidity, counterparty, market, and operational risk. Digital assets may fluctuate significantly and can lose substantial or all of their value. Transactions may be irreversible, and access may be lost through user error, security incidents, network failure, or changes to a third-party protocol.</p><p>Nothing on this website is an offer, solicitation, recommendation, or promise to buy, sell, hold, or invest in a financial product or digital asset. OkzByte does not guarantee investment returns. Website content is not investment, financial, tax, or legal advice. You are responsible for independently evaluating risks and the laws that apply to you. The website does not identify OkzByte as a licensed exchange, financial institution, broker, investment adviser, or custodian.</p></>
  },
  {
    id: 'payments', title: 'Payments and Commercial Transactions', search: 'payment checkout billing price currency taxes subscription refunds cancellation invoices',
    body: <><p>The reviewed public website does not provide a checkout, payment, subscription, billing, or paid-account flow. These general Terms therefore do not set prices, currencies, taxes, renewal rules, refund eligibility, or payment-processor arrangements.</p><p>If OkzByte later offers a paid product, the price, applicable taxes, payment authorization, billing cycle, cancellation method, refund terms, and processor will be shown in the applicable order flow or agreement before purchase. No return or refund policy is linked as an active public policy in the reviewed source; no refund promise is made here.</p></>
  },
  {
    id: 'intellectual-property', title: 'Intellectual Property Rights', search: 'copyright intellectual property logo brand text images video software source code research trademarks',
    body: <><p>Except for third-party materials and material offered under a separate license, the website's original branding, logos, design, text, graphics, media, software, documentation, and other content are owned by or used with permission of the relevant rights holder. “OkzByte” and associated marks may not be used to imply an affiliation or endorsement without authorization.</p><p>You may view and use the public site for personal or internal business reference. Unless the law allows otherwise or a specific license permits it, you may not copy, modify, redistribute, publicly perform, sell, commercially exploit, or create derivative works from protected site materials without prior permission.</p><p>Research publications, open-source components, images, linked resources, and other third-party materials remain subject to their own copyright, attribution, and license terms. These Terms do not claim ownership over them. If you believe content infringes your rights, contact <a href="mailto:hello@okzbyte.com">hello@okzbyte.com</a> with enough information to identify the material and concern.</p></>
  },
  {
    id: 'acceptable-use', title: 'Acceptable Use Policy', search: 'prohibited use hacking malware phishing impersonation fraud spam scraping abuse security controls',
    body: <><p>You may not use the site or any future service to break the law or to:</p><ul><li>gain unauthorized access to systems, accounts, networks, or data, or test for vulnerabilities without permission;</li><li>create, distribute, or deploy malware; phish, impersonate, defraud, or facilitate a fraudulent transaction;</li><li>send spam, conduct abusive automation, or scrape content in a way that violates law, these Terms, or reasonable access controls;</li><li>infringe intellectual-property, privacy, or other rights, or publish unlawful or harmful material;</li><li>interfere with availability, bypass security controls, overload systems, or reverse engineer restricted services except where law permits; or</li><li>use AI, blockchain, or developer tools for unlawful, harmful, deceptive, or unauthorized activity.</li></ul><p>Where a violation is reasonably verified, we may investigate and restrict access, suspend a relevant feature, or take other proportionate steps, subject to applicable law and any product-specific agreement.</p></>
  },
  {
    id: 'third-party-services', title: 'Third-Party Services and External Links', search: 'third party providers external websites links social ecosystem project ownership partnership endorsement',
    body: <><p>The website may link to external websites, social platforms, datasets, repositories, or service providers. We do not control their availability, content, security, or privacy practices. A link is provided for convenience and does not necessarily mean that OkzByte endorses or guarantees the destination.</p><p>The site describes OkzByte as part of a broader ecosystem and references independent projects. <strong>Listing or referencing an external project within the OkzByte ecosystem does not automatically establish common ownership, legal control, financial responsibility, technical integration, endorsement, or partnership.</strong> A project's operator, ownership, contractual terms, and responsibilities must be identified separately where relevant. OkzByte is not automatically responsible for an independently operated project's actions or services.</p><p>Review the third party's own terms and privacy notice before using its service or sharing information with it.</p></>
  },
  {
    id: 'developer-resources', title: 'Developer Resources and APIs', search: 'developer tools API access credentials rate limits documentation SLA licensing',
    body: <><p>The reviewed public website does not publish a general developer API, API credentials, or public API rate schedule. Internal endpoints used to operate website forms are not an invitation to access or use a public API.</p><p>If developer resources become available, access requirements, authentication, permitted use, rate limits, documentation status, support, and commercial licensing will be set out in applicable documentation or a separate agreement. Do not probe or use non-public endpoints or credentials. No service-level guarantee or API limit is created by this section.</p></>
  },
  {
    id: 'research', title: 'Research and Publications', search: 'research publications papers articles technical documentation sources citation validation advice',
    body: <><p>Research articles, technical documents, and educational content on the site are provided for informational and research purposes. Publication does not guarantee that an item has been peer-reviewed, independently replicated, or validated for a particular use. Methods, assumptions, and conclusions may have limitations.</p><p>Respect the author's attribution, citations, copyright, and any stated license. Do not reproduce or redistribute protected material except as permitted by applicable law or the relevant license. Research content is not professional advice, a product warranty, or a guarantee of a result.</p></>
  },
  {
    id: 'careers', title: 'Careers and Applications', search: 'careers recruitment jobs candidates talent network CV resume employment selection',
    body: <><p>The Careers page currently states that there are no verified public openings and offers a talent-network expression-of-interest form. Submitting interest is not an application to a live vacancy, an offer of employment, or a promise that OkzByte will contact or select you. No selection, interview, internship, compensation, benefit, or employment outcome is guaranteed.</p><p>Provide accurate information and only information you are entitled to share. Candidate information is handled under the <a href="/privacy">Privacy Policy</a>. The reviewed public page does not currently accept CV uploads or applications to listed vacancies. Any eventual employment relationship would be governed by a separate written agreement and applicable law.</p></>
  },
  {
    id: 'privacy', title: 'Privacy and Personal Data', search: 'privacy personal information data policy cookies deletion request account',
    body: <><p>Personal information is handled according to the applicable <a href="/privacy">Privacy Policy</a> and relevant law. Please review that notice before using forms or submitting personal information. The Privacy Policy explains the current website's forms, conditional providers, privacy-request options, and limitations that require administrator or legal confirmation.</p><ul><li><a href="/privacy">Privacy Policy</a></li><li><a href="/privacy#cookies">Cookie information</a> (included in the Privacy Policy; no separate Cookie Policy is currently published)</li><li><a href="/privacy#account-deletion">Account access and deletion information</a> (the site does not currently offer public user accounts)</li><li><a href="/privacy#contact">Privacy requests</a></li></ul></>
  },
  {
    id: 'disclaimers', title: 'Disclaimers', search: 'disclaimer as is availability accuracy third party software limitation AI blockchain',
    body: <><p>To the extent permitted by applicable law, the website and its general informational content are provided “as is” and “as available,” without a promise that they will be complete, accurate, suitable, uninterrupted, secure, or free from errors. We do not guarantee that a particular technology, product, feature, or external service will remain available or work with every device or environment.</p><p>Information may become outdated. External websites and networks may be unavailable or change independently. Software, AI-generated outputs, blockchain networks, and third-party infrastructure have technical limitations and risks described above. Nothing in these Terms excludes a warranty or right that cannot lawfully be excluded.</p></>
  },
  {
    id: 'liability', title: 'Limitation of Liability', search: 'liability indirect consequential damages consumer mandatory rights legal limitations',
    body: <><p>Nothing in these Terms excludes or limits liability, a consumer guarantee, or another right where applicable law does not allow that exclusion or limitation, including liability for fraud, intentional misconduct, or personal injury where it cannot lawfully be limited.</p><p>To the fullest extent permitted by applicable law, OkzByte will not be liable for indirect, incidental, special, exemplary, punitive, or consequential loss, or for lost profits, revenues, opportunities, data, goodwill, or business interruption arising from use of or inability to use the website. This applies only where the relevant type of loss may lawfully be excluded.</p><p>No arbitrary monetary cap is set by these website Terms. Any limitation that must be quantified or tailored to a paid service will be stated in the applicable product or commercial agreement and remain subject to mandatory rights.</p></>
  },
  {
    id: 'indemnification', title: 'Indemnification', search: 'indemnification claims losses unlawful use breach infringement proportional',
    body: <><p>To the extent allowed by applicable law, you are responsible for third-party claims and reasonable losses directly arising from your unlawful use of a service, your material breach of these Terms, or your infringement of another person's rights. This does not apply to the extent a claim is caused by OkzByte's own breach, negligence, or unlawful conduct, or where applicable law does not permit shifting that responsibility.</p><p>Any cooperation, notice, defense, or settlement process must be proportionate and consistent with applicable law and any product-specific agreement.</p></>
  },
  {
    id: 'suspension', title: 'Suspension and Termination', search: 'suspension termination access security threats abuse legal requirements deletion retention',
    body: <><p>We may restrict access to the website or a specific feature where reasonably necessary to address a security threat, abuse, unlawful activity, a serious violation of these Terms, a legal requirement, or a material risk to other users or systems. Where appropriate and lawful, we will seek to limit the restriction to the affected service and provide notice.</p><p>The public website does not currently provide general user accounts to terminate. If you have submitted personal information, deletion and retention requests are handled under the <a href="/privacy#retention">Privacy Policy's retention section</a> and applicable law. Separate product or employment agreements may govern termination of those relationships.</p></>
  },
  {
    id: 'changes', title: 'Changes to Services and Terms', search: 'changes update versions revisions effective date history archive',
    body: <><p>We may change these Terms or the website as technology, services, or legal requirements change. The current version and “Last updated” date appear at the top of this page. If a change is material, we will provide notice by a method and within a timeframe required by applicable law or a separate agreement. A new version does not retroactively remove rights that have already accrued where the law protects them.</p><p>The current page presents version 1.0 as an operational draft. The public repository does not provide a policy CMS, draft/publish controls, or complete revision-history workflow. Archived versions should be retained and made available where required.</p></>
  },
  {
    id: 'governing-law', title: 'Governing Law and Dispute Resolution', search: 'governing law jurisdiction court arbitration dispute legal entity country',
    body: <><p>No governing country, court venue, or arbitration location is specified here because the responsible legal entity, operating jurisdiction, and appropriate dispute forum have not been verified for this website. This is an explicit administrator and qualified legal-review item, not an implied choice of law.</p><p>Applicable mandatory consumer protections and statutory rights remain unaffected. Before final publication, OkzByte should confirm the relevant entity and jurisdiction and have counsel draft any governing-law, venue, complaint, or alternative dispute-resolution terms that are appropriate and enforceable.</p></>
  },
  {
    id: 'contact', title: 'Contact and Legal Notices', search: 'contact legal notices email business legal registered address legal entity',
    body: <><p>For questions about these Terms, contact <a href="mailto:hello@okzbyte.com">hello@okzbyte.com</a>, the official contact email already displayed on the website. The reviewed site does not publish a verified registered address, registration number, or dedicated legal-notices email. No such details are invented here.</p><p>For privacy requests, use the contact information and request options in the <a href="/privacy">Privacy Policy</a>. Formal notices required by a separate agreement should be sent using the method specified in that agreement.</p></>
  }
];

function textFromNode(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join(' ');
  return textFromNode(node.props?.children);
}

export default function TermsPage() {
  const [query, setQuery] = useState('');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const visibleSections = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? termsSections.filter(section => `${section.title} ${section.search} ${textFromNode(section.body)}`.toLowerCase().includes(term)) : termsSections;
  }, [query]);

  useEffect(() => {
    document.title = 'Terms of Service — OkzByte Technology';
    const upsert = (selector, tag, attrs) => {
      let el = document.head.querySelector(selector);
      if (!el) { el = document.createElement(tag); document.head.appendChild(el); }
      Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    };
    upsert('meta[name="description"]', 'meta', { name: 'description', content: 'Terms of Service for the OkzByte Technology website, technology information, research and associated resources.' });
    upsert('link[rel="canonical"]', 'link', { rel: 'canonical', href: 'https://okzbyte.vercel.app/terms-and-conditions' });
    upsert('meta[property="og:title"]', 'meta', { property: 'og:title', content: 'Terms of Service — OkzByte Technology' });
    upsert('meta[property="og:description"]', 'meta', { property: 'og:description', content: 'Clear terms, responsible technology, and transparent digital experiences.' });
    let breadcrumb = document.getElementById('okzbyte-terms-breadcrumb');
    if (!breadcrumb) { breadcrumb = document.createElement('script'); breadcrumb.id = 'okzbyte-terms-breadcrumb'; breadcrumb.type = 'application/ld+json'; document.head.appendChild(breadcrumb); }
    breadcrumb.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://okzbyte.vercel.app/' }, { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: 'https://okzbyte.vercel.app/terms-and-conditions' }] });
    return () => breadcrumb.remove();
  }, []);

  return <main className="terms-page">
    <section className="terms-hero">
      <div className="terms-hero-grid" aria-hidden="true"/>
      <div className="terms-hero-inner">
        <div className="section-label"><span/>OKZBYTE TECHNOLOGY / LEGAL</div>
        <h1>Terms of<br/><em>Service.</em></h1>
        <p>Clear terms. Responsible technology. Transparent digital experiences.</p>
        <p className="terms-operator">Operator name supplied by site owner: <strong>OkzByte Technology</strong></p>
        <div className="terms-meta"><span><small>POLICY</small>Terms and Conditions</span><span><small>EFFECTIVE DATE*</small>15 November 2026</span><span><small>LAST UPDATED</small>15 November 2026</span><span><small>VERSION</small>1.0 / Review draft</span></div>
        <div className="terms-actions"><a className="terms-print terms-download" href="/terms-and-conditions.pdf" download><ArrowDownToLine size={15}/> Download PDF</a><button className="terms-print" onClick={() => window.print()}>Print Policy</button></div>
        <p className="terms-effective-note">*Effective date is subject to administrator and qualified legal review.</p>
      </div>
    </section>

    <div className="terms-review-notice" role="note"><ShieldCheck size={20}/><p><strong>Review status: operational draft.</strong> These Terms describe only features verified in the repository. The responsible legal entity's registration details, governing jurisdiction, consumer-law requirements, and final liability language need administrator and qualified legal review. No legal compliance or guaranteed enforceability is claimed.</p></div>

    <div className="terms-layout">
      <aside className="terms-sidebar" aria-label="Terms of Service navigation">
        <button className="terms-toc-toggle" aria-expanded={mobileTocOpen} onClick={() => setMobileTocOpen(value => !value)}>In these terms <ChevronDown size={16}/></button>
        <div className={`terms-sidebar-content ${mobileTocOpen ? 'open' : ''}`}>
          <label className="terms-search"><Search size={15}/><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search these terms" aria-label="Search within the Terms of Service"/></label>
          <nav className="terms-toc">{visibleSections.map(section => <a key={section.id} href={`#${section.id}`} onClick={event => { event.preventDefault(); setMobileTocOpen(false); window.history.replaceState({}, '', `#${section.id}`); document.getElementById(section.id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }}><span>{String(termsSections.indexOf(section) + 1).padStart(2, '0')}</span>{section.title}</a>)}</nav>
          {visibleSections.length === 0 && <p className="terms-no-results">No matching sections. Clear your search to view the full terms.</p>}
          <a className="terms-sidebar-contact" href="mailto:hello@okzbyte.com">Legal questions <ArrowUpRight size={14}/></a>
        </div>
      </aside>
      <div className="terms-content">
        <div className="terms-intro"><span>24 SECTIONS / VERSION 1.0</span><p>These Terms and Conditions govern access to and use of the OkzByte website, digital platforms, services and associated resources. By accessing or using applicable services, you agree to the terms that apply to your use.</p><p>Separate product-specific terms may apply to individual products or services where provided and accepted.</p></div>
        {visibleSections.map(section => <section className="terms-section" id={section.id} key={section.id}><div className="terms-section-number">{String(termsSections.indexOf(section) + 1).padStart(2, '0')} <i/></div><div><h2>{section.title}</h2><div className="terms-prose">{section.body}</div></div></section>)}
        <div className="terms-version-history"><div className="terms-section-number">HISTORY <i/></div><div><h2>Version history</h2><p><strong>Version 1.0 · 15 November 2026</strong><br/>Initial repository-grounded operational draft. Pending administrator confirmation and qualified legal review before final publication.</p></div></div>
        <div className="terms-endnote"><span>OKZBYTE TECHNOLOGY / TERMS OF SERVICE / v1.0</span><a href="#top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top ↑</a></div>
      </div>
    </div>
  </main>;
}
