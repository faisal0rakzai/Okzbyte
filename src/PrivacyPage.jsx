import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, CheckCircle2, ChevronDown, Search, ShieldCheck } from 'lucide-react';
import './privacy.css';

const sections = [
  {
    id: 'introduction', title: 'Introduction', search: 'purpose transparency privacy data protection responsible use',
    body: <><p>This Privacy Policy explains how OkzByte handles personal information when you visit its public website, read research content, send a research proposal, or use a talent-network form. It is written against the website code and database migrations reviewed on 15 November 2026—not as a claim that every optional service is active in every deployment.</p><p><strong>Review status:</strong> this is an operational draft. OkzByte still needs to confirm its legal entity and operating locations, live hosting and provider configuration, retention periods, and applicable legal requirements before treating this notice as final. This page is informational and is not legal advice.</p></>
  },
  {
    id: 'scope', title: 'Scope of This Policy', search: 'website public research careers third party external sites scope',
    body: <><p>This Policy applies to the OkzByte public website, including its About, Contact, Careers, Research, and related pages, and to personal information submitted through forms that are connected to the site backend. It does not govern independent external websites or services linked from the site; those providers publish their own privacy notices.</p><p>The source repository contains prototype and backend-ready features. Actual processing depends on the production deployment, database migrations, and server environment variables. A form or integration described as conditional below is not proof it is live.</p></>
  },
  {
    id: 'information-we-collect', title: 'Information We Collect', search: 'categories data personal information names emails technical information no accounts',
    body: <><p>The current site does not provide user account registration, payments, or a public CV upload flow. The categories that may be processed by the features found in the repository are:</p><ul><li><strong>Research proposals:</strong> name, email, optional organization and external link, research area, proposal type, proposal text, and consent.</li><li><strong>Research newsletter requests:</strong> email address, optional topic selections, and consent. The code records requests as pending until email confirmation is configured; it does not currently make the visitor an active subscriber.</li><li><strong>Careers talent-network interest:</strong> name, email, area of interest, optional portfolio URL, note, and consent. This path uses a server endpoint and is designed to store through Supabase when configured; optional notification uses Resend when configured.</li><li><strong>Contact inquiries:</strong> the visible Contact form currently reports a local prototype state and does not send a message. A separate server API exists that can store a name, email, optional organization, inquiry category and message, plus a one-way hash of a client network identifier, if that endpoint is deployed and wired to the form and a database.</li><li><strong>Technical information:</strong> web servers and hosting providers may process connection data such as IP address, browser, device, request time, and requested URL. The application also reads a forwarded client address for basic in-memory rate limits. Actual host logs and their retention settings have not been verified.</li></ul><p>We do not claim that the current public site collects payment-card, biometric, government-ID, precise-location, or account-registration data. The careers database migration contains a schema for job applications and CV metadata, but the current public Careers page does not offer that application or upload flow.</p></>
  },
  {
    id: 'information-you-provide', title: 'Information You Provide', search: 'voluntary forms name email proposals newsletter careers talent consent',
    body: <><p>Information entered in research proposal and newsletter forms is sent to their respective server endpoints. The talent-network form sends its fields to the careers endpoint; successful storage depends on the required database schema and server configuration. Please do not include confidential, special-category, or highly sensitive information in a free-text field.</p><p>The Contact page form is presently a front-end prototype and displays a local confirmation only. Do not assume a contact message has reached OkzByte unless you receive a response through an independently working contact channel. You may email <a href="mailto:hello@okzbyte.com">hello@okzbyte.com</a>.</p></>
  },
  {
    id: 'automatically-collected', title: 'Automatically Collected Information', search: 'automatic server request logs IP address rate limiting browser device',
    body: <><p>When a browser requests a page or API, the hosting layer may receive technical connection details, including an IP address and user-agent information. The application's rate limiter uses the forwarded client address or the socket address to limit certain submissions in process memory. If the contact API is used, it stores a SHA-256 hash derived from that client identifier with the inquiry; the original identifier is not placed in the response.</p><p>The source does not establish the production host's access-log fields, retention, or monitoring configuration. Those settings must be checked with the current hosting provider.</p></>
  },
  {
    id: 'how-we-use', title: 'How We Use Your Information', search: 'purposes process respond maintain review research careers prevent abuse security legal',
    body: <><p>Depending on which feature is enabled, OkzByte may use submitted information to operate and maintain the website; review and respond to research proposals, contact inquiries, or talent-network expressions of interest; record consent and newsletter preferences; protect the service from spam or abuse using rate limits; maintain system security; and meet applicable legal obligations.</p><p>Research content and public site usage are not described in the code as being used for personalized advertising. Information is not used for unrelated purposes on the basis of a vague or blanket justification.</p></>
  },
  {
    id: 'cookies', title: 'Cookies and Similar Technologies', search: 'cookies essential functional analytics marketing consent admin session',
    body: <><p>The source reviewed does not install analytics or advertising cookies, and no optional cookie-consent interface is present. Ordinary public browsing is not shown to set a site cookie. Browser storage preferences for analytics or marketing are not currently implemented because those trackers are not present in the reviewed source.</p><p>If an administrator login is configured, the server issues an <code>okz_session</code> cookie for that private session. The code marks it HttpOnly and SameSite=Strict, uses Secure in production, and sets an eight-hour maximum age. This is an authentication cookie, not an advertising cookie. You can also manage cookies in your browser settings.</p><p>If optional analytics or marketing technologies are introduced, OkzByte should update this Policy and implement any consent controls required by applicable law before activating them.</p></>
  },
  {
    id: 'analytics', title: 'Analytics and Tracking', search: 'analytics tracking pixels telemetry measurement',
    body: <><p>No analytics SDK, advertising pixel, or third-party behavioral tracking script was found in the reviewed application entry point and source files. This statement is limited to the repository snapshot reviewed; hosting-provider logs or later production changes may differ and must be verified before publication.</p></>
  },
  {
    id: 'third-parties', title: 'Data Sharing and Third-Party Services', search: 'providers Google Fonts Supabase Resend hosting social external links',
    body: <><p>OkzByte does not sell personal information through any feature found in the reviewed source. Data may be processed by a service provider only when the relevant feature is deployed and configured:</p><ul><li><strong>Google Fonts:</strong> the page loads Manrope and DM Mono from Google Fonts. A browser requesting those fonts connects to Google; see <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google's Privacy Policy</a>.</li><li><strong>Supabase:</strong> the server code can use a Supabase REST API to store careers talent-network records when server-side credentials are configured. No browser-side Supabase secret is present in the source. See <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer">Supabase's Privacy Policy</a>.</li><li><strong>Resend:</strong> if configured, the server can email careers talent-network notifications to an administrator-selected address. Email delivery and destination depend on deployment settings. See <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noreferrer">Resend's Privacy Policy</a>.</li><li><strong>Hosting and database providers:</strong> the code includes Vercel route configuration and PostgreSQL/Supabase support, but the active production host, region, logs, backups, and provider contracts have not been verified from source alone.</li><li><strong>External links:</strong> links may lead to social platforms, Zenodo, Hugging Face, or other independent sites. When you follow a link, the destination provider's terms and privacy notice apply. See, for example, <a href="https://about.zenodo.org/privacy-policy/" target="_blank" rel="noreferrer">Zenodo's privacy notice</a>.</li></ul><p>Provider integrations described as configurable may not be active. OkzByte must confirm the actual production configuration and contractual roles.</p></>
  },
  {
    id: 'security', title: 'Data Storage and Security', search: 'security HTTPS headers CSP password scrypt database access encryption backups',
    body: <><p>Verified controls in the reviewed application code include security response headers (including content-type protection, frame denial, a Content Security Policy, and a referrer policy), server-side handling of secret environment variables, parameterized SQL for database writes and reads, input validation, payload-size limits, and basic in-memory rate limits on selected submission routes. Administrator password verification uses Node.js scrypt; configured administrator sessions use an HttpOnly, SameSite=Strict cookie and Secure in production.</p><p>These code-level measures do not establish that every endpoint is deployed, or that production transport encryption, database permissions, access reviews, secure backups, security monitoring, incident response, or file-upload scanning are configured. The current public careers form does not accept CV uploads. No claim is made about encryption at rest, end-to-end encryption, penetration testing, or certifications.</p></>
  },
  {
    id: 'international-transfers', title: 'International Data Transfers', search: 'international transfers cross border providers hosting Google Supabase Resend',
    body: <><p>Google Fonts and any enabled hosting, database, or email providers may process technical or submitted information in locations outside your country. The production provider regions and transfer arrangements have not been confirmed from the repository. OkzByte should identify the relevant locations and establish any safeguards required by applicable law before enabling those integrations.</p></>
  },
  {
    id: 'retention', title: 'Data Retention', search: 'retention deletion schedule account contact newsletter recruitment logs',
    body: <><p>The repository does not configure fixed deletion periods for contact inquiries, research proposals, newsletter requests, or careers talent records. No account-data retention period applies to the public website because it has no public account-registration feature. Hosting and security-log retention is controlled partly by the active provider and has not been verified.</p><p>Until OkzByte approves and implements a retention schedule, it cannot give a precise period. Records should be kept only as long as needed for the purpose, applicable legal requirements, and resolving legitimate disputes, then deleted or anonymized. An administrator must set and document category-specific schedules before production launch.</p></>
  },
  {
    id: 'rights', title: 'Your Privacy Rights', search: 'rights access correction deletion objection portability withdraw consent complaint',
    body: <><p>Depending on where you live and which laws apply, you may have rights to request access to or correction of personal information, request deletion, withdraw consent, object to certain processing, request a portable copy, opt out of marketing, or complain to a regulator. The availability and conditions of each right depend on applicable law; this Policy does not promise rights beyond those laws.</p><p>Contact <a href="mailto:hello@okzbyte.com">hello@okzbyte.com</a> to make a request. OkzByte may need reasonable information to verify the requester's identity and may have to retain certain records where law permits or requires. Do not send passwords, identity documents, or other sensitive verification material unless OkzByte first explains a secure, appropriate method.</p></>
  },
  {
    id: 'account-deletion', title: 'Account Access and Deletion', search: 'account access deletion no account registration request',
    body: <><p>The reviewed public site does not provide public user accounts, so there is no public account sign-in or account-deletion page. If you submitted information through a connected form, you can request access, correction, or deletion through the privacy request form below or by emailing <a href="mailto:hello@okzbyte.com">hello@okzbyte.com</a>.</p></>
  },
  {
    id: 'careers', title: 'Careers and Recruitment Data', search: 'careers recruitment CV resume talent network job applications candidate data',
    body: <><p>The visible Careers page has a talent-network form that requests a name, email, area of interest, optional portfolio URL, short note, and consent. Its server endpoint is designed to store records in the Supabase <code>career_talent_network</code> table when the corresponding schema and server credentials are configured. It can send a notification through Resend when its settings are configured.</p><p>The Careers page currently states there are no verified openings and does not provide a CV upload or live-job application flow. A separate migration contains tables for future job applications and CV storage metadata, but a schema alone does not mean those functions are operational. If that changes, OkzByte should explain candidate access, storage, third parties, and deletion periods before collecting applications. Candidates can send privacy requests using the contact details in this Policy.</p></>
  },
  {
    id: 'newsletter', title: 'Newsletter and Communications', search: 'newsletter unsubscribe subscription pending confirmation email',
    body: <><p>The Research page newsletter asks for an email address, optional topic interests, and consent. The server code records a request as <code>pending_confirmation</code> when the research database is configured; the interface expressly says visitors are not subscribed until an email confirmation flow is available. No unsubscribe or delivery workflow is present in the reviewed source. A separate footer email field is a nonfunctional front-end form.</p><p>If you receive a message from OkzByte, you may use its unsubscribe link if available or email <a href="mailto:hello@okzbyte.com">hello@okzbyte.com</a> to opt out.</p></>
  },
  {
    id: 'children', title: 'Children and Minors', search: 'children minors age underage personal information',
    body: <><p>The website is not designed or directed to children, and the reviewed forms are not intended for children to submit personal information. OkzByte does not knowingly seek to collect children's information in circumstances where that is prohibited. If you believe a child has submitted personal information, contact <a href="mailto:hello@okzbyte.com">hello@okzbyte.com</a> so the matter can be reviewed and appropriate deletion steps considered.</p></>
  },
  {
    id: 'external-sites', title: 'Third-Party Websites', search: 'external websites links social independent privacy terms',
    body: <><p>OkzByte pages link to independent services and social platforms. Their privacy practices, cookies, and content are controlled by those providers, not this Policy. Review the relevant provider notice before sharing information with them.</p></>
  },
  {
    id: 'changes', title: 'Changes to This Policy', search: 'changes updates revisions policy version effective date',
    body: <><p>OkzByte may revise this Policy as website features, providers, or legal requirements change. The page's “Last updated” date and version should be changed when a revised policy is approved. Material changes should be communicated through an appropriate channel where required by law. The repository does not currently provide policy version history or a CMS publishing workflow.</p></>
  },
  {
    id: 'contact', title: 'Contact and Privacy Requests', search: 'contact email privacy request access correction deletion portability consent complaint',
    body: <><p>For privacy questions or requests, contact <a href="mailto:hello@okzbyte.com">hello@okzbyte.com</a>, the official contact address already shown on the website. The repository does not identify a dedicated privacy email, appointed privacy officer, registered legal entity, or physical legal address; none is invented here. An administrator should confirm a dedicated privacy contact before production publication.</p><p>The form below is intended to send requests privately to the server, generate a reference number, and save them in the database. It requires the privacy-request database migration and a working server/database deployment. If the endpoint is unavailable, email the contact above instead. Do not include passwords, identity documents, or unrelated sensitive information.</p></>
  }
];

const requestTypes = ['Access', 'Correction', 'Deletion', 'Data Portability', 'Withdraw Consent', 'Other Privacy Concern'];

function textFromNode(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join(' ');
  return textFromNode(node.props?.children);
}

export default function PrivacyPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('idle');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const visibleSections = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return sections;
    return sections.filter(section => `${section.title} ${section.search} ${textFromNode(section.body)}`.toLowerCase().includes(term));
  }, [query]);

  useEffect(() => {
    document.title = 'Privacy Policy & Data Protection Center — OkzByte';
    const upsert = (selector, tag, attrs) => {
      let el = document.head.querySelector(selector);
      if (!el) { el = document.createElement(tag); document.head.appendChild(el); }
      Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    };
    upsert('meta[name="description"]', 'meta', { name: 'description', content: 'Read the OkzByte privacy policy, data practices, privacy rights, and contact details.' });
    upsert('link[rel="canonical"]', 'link', { rel: 'canonical', href: 'https://okzbyte.vercel.app/privacy' });
    upsert('meta[property="og:title"]', 'meta', { property: 'og:title', content: 'Privacy Policy & Data Protection Center — OkzByte' });
    upsert('meta[property="og:description"]', 'meta', { property: 'og:description', content: 'How OkzByte handles information across its public website, research, and careers features.' });
    let breadcrumb = document.getElementById('okzbyte-privacy-breadcrumb');
    if (!breadcrumb) { breadcrumb = document.createElement('script'); breadcrumb.id = 'okzbyte-privacy-breadcrumb'; breadcrumb.type = 'application/ld+json'; document.head.appendChild(breadcrumb); }
    breadcrumb.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://okzbyte.vercel.app/' }, { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://okzbyte.vercel.app/privacy' }] });
    return () => breadcrumb.remove();
  }, []);

  async function submitRequest(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/api/privacy/requests', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fullName: data.get('fullName'), email: data.get('email'), requestType: data.get('requestType'), description: data.get('description'), supportingInfo: data.get('supportingInfo'), consent: data.get('consent') === 'on' })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || result.error || 'The privacy request service is not available. Please email hello@okzbyte.com.');
      setReference(result.reference || 'RECEIVED');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setError(err.message || 'The request could not be submitted. Please email hello@okzbyte.com.');
      setStatus('error');
    }
  }

  return <main className="privacy-page">
    <section className="privacy-hero">
      <div className="privacy-hero-grid" aria-hidden="true" />
      <div className="privacy-hero-inner">
        <div className="section-label"><span />OKZBYTE / DATA PROTECTION CENTER</div>
        <h1>Your Privacy.<br/><em>Our Responsibility.</em></h1>
        <p>Transparency and responsible data protection are fundamental to the way we build and operate digital technology.</p>
        <div className="privacy-meta"><span><small>POLICY</small>Privacy Policy</span><span><small>EFFECTIVE DATE</small>15 November 2026*</span><span><small>LAST UPDATED</small>15 November 2026</span><span><small>VERSION</small>1.0 / Review draft</span></div>
        <button className="privacy-print" onClick={() => window.print()}><ArrowDownToLine size={15}/> Print / Save as PDF</button>
        <p className="privacy-effective-note">*Effective date is subject to administrator and qualified legal review. See the review notice below.</p>
      </div>
    </section>

    <div className="privacy-review-notice" role="note"><ShieldCheck size={20}/><p><strong>Review status: operational draft.</strong> This page is based on the source repository reviewed on 15 November 2026. Production hosting, enabled providers, legal entity/jurisdiction, retention schedules, and legal obligations still require confirmation. Conditional integrations below may not be active in your deployment.</p></div>

    <div className="privacy-layout">
      <aside className="privacy-sidebar" aria-label="Privacy policy navigation">
        <button className="privacy-toc-toggle" aria-expanded={mobileTocOpen} onClick={() => setMobileTocOpen(value => !value)}>In this policy <ChevronDown size={16}/></button>
        <div className={`privacy-sidebar-content ${mobileTocOpen ? 'open' : ''}`}>
          <label className="privacy-search"><Search size={15}/><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search this policy" aria-label="Search within the privacy policy"/></label>
          <nav className="privacy-toc">{visibleSections.map(section => <a key={section.id} href={`#${section.id}`} onClick={() => setMobileTocOpen(false)}><span>{String(sections.indexOf(section) + 1).padStart(2, '0')}</span>{section.title}</a>)}</nav>
          {visibleSections.length === 0 && <p className="privacy-no-results">No matching sections. Clear the search to see the full policy.</p>}
          <a className="privacy-sidebar-contact" href="mailto:hello@okzbyte.com">Privacy questions <ArrowUpRight size={14}/></a>
        </div>
      </aside>

      <div className="privacy-content">
        <div className="privacy-intro"><span>20 SECTIONS / POLICY v1.0</span><p>This notice distinguishes information a visitor chooses to submit from technical information a service may process to deliver and protect the site.</p></div>
        {visibleSections.map(section => <section className="privacy-section" id={section.id} key={section.id}>
          <div className="privacy-section-number">{String(sections.indexOf(section) + 1).padStart(2, '0')} <i/></div>
          <div><h2>{section.title}</h2><div className="privacy-prose">{section.body}</div></div>
        </section>)}

        <section className="privacy-request" id="privacy-request">
          <div className="privacy-section-number">PRIVACY <i/></div>
          <div className="privacy-request-inner">
            <div className="section-label"><span/>MAKE A PRIVATE REQUEST</div>
            <h2>Let us know<br/><span>what you need.</span></h2>
            <p>Choose a request type and provide enough detail to help us locate the relevant record. The form must not be used for emergencies or general business inquiries.</p>
            {status === 'sent' ? <div className="privacy-success" role="status"><CheckCircle2 size={26}/><div><strong>Request received</strong><p>Your private request reference is <b>{reference}</b>. Keep it for follow-up. Do not share it publicly.</p><button type="button" className="privacy-reset" onClick={() => setStatus('idle')}>Submit another request</button></div></div> : <form className="privacy-request-form" onSubmit={submitRequest}>
              <label>Full name<input name="fullName" autoComplete="name" minLength="2" maxLength="120" required/></label>
              <label>Email address<input name="email" type="email" autoComplete="email" maxLength="254" required/></label>
              <label className="privacy-form-wide">Request type<select name="requestType" required defaultValue=""><option value="" disabled>Select a privacy request</option>{requestTypes.map(type => <option key={type}>{type}</option>)}</select></label>
              <label className="privacy-form-wide">Description<textarea name="description" minLength="10" maxLength="4000" required placeholder="Describe the information or request. Please do not include passwords or identity documents."/></label>
              <label className="privacy-form-wide">Supporting information <span>(optional)</span><textarea name="supportingInfo" maxLength="2000" placeholder="For example, which form or approximate date may help us find the record."/></label>
              <label className="privacy-consent privacy-form-wide"><input name="consent" type="checkbox" required/><span>I confirm that I am asking OkzByte to use the details above only to assess, verify, and respond to this privacy request. I have read this Privacy Policy.</span></label>
              {status === 'error' && <p className="privacy-error privacy-form-wide" role="alert">{error} <a href="mailto:hello@okzbyte.com">Email OkzByte</a></p>}
              <button className="button button-primary privacy-form-wide" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Submitting securely…' : 'Submit privacy request'} <ArrowUpRight size={16}/></button>
              <p className="privacy-form-footnote privacy-form-wide">The form uses the site's server API and is stored only if the database and privacy-request migration are configured. If it is unavailable, email <a href="mailto:hello@okzbyte.com">hello@okzbyte.com</a>. Request content is not included in page URLs.</p>
            </form>}
          </div>
        </section>

        <div className="privacy-endnote"><span>OKZBYTE / PRIVACY POLICY / v1.0</span><a href="#top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top ↑</a></div>
      </div>
    </div>
  </main>;
}
