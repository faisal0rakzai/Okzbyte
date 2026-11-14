import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Bot, Boxes, BrainCircuit, Blocks,
  Cable, Check, ChevronDown, Cloud, Code2, Cpu, Database, Fingerprint,
  Gauge, Landmark, Layers3, LockKeyhole, Network, Radio, ScanLine,
  ServerCog, ShieldCheck, Sparkles, Workflow,
} from 'lucide-react';
import TechEcosystemScene from './TechEcosystemScene.jsx';
import './technologies.css';

const domains = [
  {
    id: 'artificial-intelligence', no: '01', short: 'AI', title: 'Artificial Intelligence', icon: BrainCircuit,
    description: 'Machine learning, generative models, intelligent agents, automation, AI infrastructure, and model development.',
    enables: 'Software that can interpret context, generate useful outputs, assist decisions, and coordinate repeatable work—with people remaining accountable for important outcomes.',
    components: ['Machine learning', 'Generative AI & LLMs', 'AI agents', 'Inference & optimization', 'Human–AI interaction'],
    uses: ['Knowledge discovery', 'Decision support', 'Workflow assistance', 'Language interfaces'],
    direction: 'Explore model evaluation, retrieval, responsible agent boundaries, inference efficiency, and practical human oversight.'
  },
  {
    id: 'blockchain', no: '02', short: 'Blockchain', title: 'Blockchain Technology', icon: Blocks,
    description: 'Smart contracts, distributed ledgers, blockchain architecture, tokenization infrastructure, and decentralized applications.',
    enables: 'Shared state and programmable rules across systems that need verifiable records, transparent execution, or coordinated participation.',
    components: ['Distributed ledgers', 'Smart contracts', 'Consensus models', 'On-chain data', 'Zero-knowledge concepts'],
    uses: ['Verifiable records', 'Programmable agreements', 'Digital asset rails', 'Public application logic'],
    direction: 'Study contract assurance, key management, privacy-preserving computation, and the trade-offs between trust models.'
  },
  {
    id: 'web3', no: '03', short: 'Web3', title: 'Web3 & Decentralized Systems', icon: Network,
    description: 'Decentralized applications, wallet connectivity, interoperability, on-chain applications, and decentralized identity.',
    enables: 'User-facing applications that can interact with open networks and portable digital identities while making trust boundaries visible.',
    components: ['Wallet connections', 'Application protocols', 'Interoperability', 'Decentralized identity', 'On-chain interfaces'],
    uses: ['Wallet-enabled experiences', 'Open protocol access', 'Portable credentials', 'Composable applications'],
    direction: 'Explore safer wallet UX, clearer signing intent, interoperable interfaces, and responsible identity patterns.'
  },
  {
    id: 'fintech', no: '04', short: 'Fintech', title: 'Financial Technology', icon: Landmark,
    description: 'Digital financial infrastructure, transaction systems, payment technology integrations, and financial software architecture.',
    enables: 'Digital experiences that coordinate payment events, account-facing workflows, transaction records, and service integrations.',
    components: ['Payment integrations', 'Transaction workflows', 'Ledger concepts', 'Account interfaces', 'Reconciliation patterns'],
    uses: ['Payment orchestration', 'Transaction tracking', 'Financial operations', 'Digital service access'],
    direction: 'Explore resilient event processing, reconciliation, privacy, and secure integration boundaries. No regulated financial product is represented here.'
  },
  {
    id: 'real-world-assets', no: '05', short: 'RWA', title: 'Real-World Assets', icon: ScanLine,
    description: 'Digital asset representation, tokenization architecture, asset-management technology, and blockchain-based financial infrastructure.',
    enables: 'A technical framework for representing asset-related records and lifecycle events in digital systems, subject to legal, custody, and operational requirements.',
    components: ['Digital representations', 'Tokenization patterns', 'Lifecycle records', 'Permissioning concepts', 'Audit trails'],
    uses: ['Asset record models', 'Lifecycle visibility', 'Document-linked workflows', 'Digital infrastructure research'],
    direction: 'Investigate identity, provenance, rights, custody interfaces, and the limits of on-chain representations. No investment outcome is implied.'
  },
  {
    id: 'cloud-infrastructure', no: '06', short: 'Cloud', title: 'Cloud & Digital Infrastructure', icon: Cloud,
    description: 'Cloud architecture, distributed computing, scalable backend systems, APIs, deployment, and infrastructure automation.',
    enables: 'Reliable foundations for software services: compute, storage, networking, deployment workflows, and service-to-service communication.',
    components: ['Cloud-native architecture', 'Distributed systems', 'APIs & services', 'Deployment automation', 'Observability'],
    uses: ['Scalable service layers', 'Connected platforms', 'Automated releases', 'Resilient workloads'],
    direction: 'Explore capacity-aware architecture, service resilience, deployment safety, and observable operations.'
  },
  {
    id: 'data-engineering', no: '07', short: 'Data', title: 'Data Engineering', icon: Database,
    description: 'Data pipelines, databases, analytics architecture, data processing, and intelligent information systems.',
    enables: 'Structured movement and stewardship of information from source systems to dependable application and analytical workflows.',
    components: ['Data pipelines', 'Database architecture', 'Data quality', 'Analytics models', 'Governance & lineage'],
    uses: ['Operational reporting', 'Information retrieval', 'Application data layers', 'Analytics foundations'],
    direction: 'Explore trustworthy data lineage, quality checks, privacy-aware data flows, and efficient processing patterns.'
  },
  {
    id: 'cybersecurity', no: '08', short: 'Security', title: 'Cybersecurity', icon: ShieldCheck,
    description: 'Application security, secure system architecture, access control, encryption concepts, threat awareness, and security engineering.',
    enables: 'Systems designed to reduce avoidable exposure, make access boundaries explicit, and protect sensitive operations and information.',
    components: ['Threat modelling', 'Authentication & access', 'Encryption concepts', 'Secure development', 'Monitoring signals'],
    uses: ['Least-privilege access', 'Protected data flows', 'Safer application design', 'Security-aware operations'],
    direction: 'Build security and privacy considerations into architecture reviews, development practices, and operational readiness.'
  },
  {
    id: 'iot', no: '09', short: 'IoT', title: 'Internet of Things', icon: Radio,
    description: 'Connected devices, sensor-driven systems, device communication, and intelligent automation.',
    enables: 'Digital systems to receive, interpret, and act on signals from connected devices where hardware, networks, and safety conditions permit.',
    components: ['Sensors & devices', 'Connectivity protocols', 'Edge processing', 'Device identity', 'Telemetry pipelines'],
    uses: ['Remote monitoring', 'Condition signals', 'Connected operations', 'Edge-to-cloud workflows'],
    direction: 'Explore device trust, intermittent connectivity, edge processing, and responsible handling of telemetry.'
  },
  {
    id: 'robotics-automation', no: '10', short: 'Robotics', title: 'Robotics & Automation', icon: Bot,
    description: 'Intelligent automation, robotic systems, control systems, and emerging physical AI technologies.',
    enables: 'A technical lens on how software, sensing, planning, and control can coordinate repeatable physical or digital tasks.',
    components: ['Control systems', 'Perception concepts', 'Task planning', 'Automation logic', 'Human oversight'],
    uses: ['Process automation', 'Assisted operations', 'Robotic workflows', 'Physical-AI exploration'],
    direction: 'Study safe human-in-the-loop design, reliable control, simulation, and the limits of autonomous actions.'
  },
];

const layers = [
  { title: 'AI & Intelligence', detail: 'Models, retrieval, and assisted workflows can provide capabilities to an application. This is a conceptual layer, not a claim of a deployed OkzByte AI service.' },
  { title: 'Application & Business Logic', detail: 'Product rules, user experiences, and service logic coordinate the actions that people and connected systems can perform.' },
  { title: 'API & Integration Layer', detail: 'APIs and events define how software services, external providers, and domain systems exchange information.' },
  { title: 'Blockchain & Financial Systems', detail: 'Where appropriate, digital ledgers and financial integrations can participate in workflows through carefully defined trust and security boundaries.' },
  { title: 'Data & Cloud Infrastructure', detail: 'Databases, pipelines, compute, and networking support persistence, processing, and scalable service delivery.' },
  { title: 'Security & Monitoring', detail: 'Identity, access controls, privacy, encryption concepts, observability, and threat-aware operations should span every layer.' },
];

const principles = [
  { title: 'Engineering first', text: 'Build around sound architecture and practical implementation.', icon: Code2 },
  { title: 'Security by design', text: 'Consider security, privacy, and access control from the beginning.', icon: LockKeyhole },
  { title: 'Scalable thinking', text: 'Design systems with adaptability and future growth in mind.', icon: Gauge },
  { title: 'Interoperability', text: 'Explore how different technologies and systems can work together.', icon: Cable },
  { title: 'Continuous innovation', text: 'Research emerging technologies and evolve with the digital landscape.', icon: Sparkles },
];

function SectionLabel({ children }) {
  return <div className="section-label"><span />{children}</div>;
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('tech-visible');
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`tech-reveal ${className}`}>{children}</div>;
}

function TechnologyHero() {
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      if (motion.matches) video.pause();
      else video.play().catch(() => {});
    };
    syncPlayback();
    motion.addEventListener?.('change', syncPlayback);
    return () => motion.removeEventListener?.('change', syncPlayback);
  }, []);
  return (
    <section className="tech-hero">
      <video ref={videoRef} className="tech-hero-video" autoPlay muted loop playsInline preload="metadata" poster="/hero-poster.jpg" aria-hidden="true">
        <source src="/okzbyte-hero.mp4" type="video/mp4" />
      </video>
      <div className="tech-hero-shade" />
      <div className="tech-hero-grid" />
      <TechEcosystemScene variant="neural" label="Animated three-dimensional neural network" />
      <div className="tech-hero-copy">
        <SectionLabel>OKZBYTE / THE TECHNOLOGY FRONTIER</SectionLabel>
        <h1>Engineering the<br /><em>Technologies</em> That<br />Shape Tomorrow<span>.</span></h1>
        <p>From artificial intelligence and decentralized systems to financial technology and intelligent infrastructure, OkzByte explores and engineers technologies that power the next generation of digital innovation.</p>
        <div className="tech-hero-actions">
          <a className="button button-primary" href="#technology-ecosystem">Explore Our Technology Stack <ArrowDown size={16} /></a>
          <a className="button button-outline" href="/contact">Discuss a Technology Project <ArrowUpRight size={16} /></a>
        </div>
      </div>
      <div className="tech-hero-meta"><span>01 / 10 DOMAINS</span><span>AI / BLOCKCHAIN / FINTECH / INFRASTRUCTURE</span><span>ENGINEERING INTELLIGENCE</span></div>
    </section>
  );
}

function EcosystemSection() {
  const [selected, setSelected] = useState(0);
  const current = domains[selected];
  const Icon = current.icon;
  return (
    <Reveal>
      <section id="technology-ecosystem" className="tech-ecosystem-section">
        <div className="tech-section-head">
          <div><SectionLabel>02 / THE TECHNOLOGY ECOSYSTEM</SectionLabel><h2>Ten domains.<br /><span>One connected frontier.</span></h2></div>
          <p>Explore how distinct technologies can connect across a larger digital system. This is an illustrative map of areas of focus—not a diagram of a deployed OkzByte platform.</p>
        </div>
        <div className="ecosystem-layout">
          <div className="ecosystem-scene-wrap">
            <TechEcosystemScene variant="network" selectedIndex={selected} onSelect={setSelected} label="Interactive three-dimensional map of ten technology domains" />
            <div className="scene-coordinate">SYSTEM MAP / CONCEPTUAL</div>
            <div className="scene-key"><span /> DOMAIN NODE <span /> CONNECTION</div>
          </div>
          <div className="ecosystem-inspector" aria-live="polite">
            <div className="inspector-index">DOMAIN / {current.no}</div>
            <Icon size={31} strokeWidth={1.25} />
            <h3>{current.title}</h3>
            <p>{current.description}</p>
            <a href={`#domain-${current.id}`} onClick={() => { const card = document.getElementById(`domain-${current.id}`); if (card) card.open = true; }} className="text-link">Explore this domain <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <div className="ecosystem-selectors" aria-label="Select a technology domain">
          {domains.map((domain, index) => <button key={domain.id} type="button" aria-pressed={selected === index} className={selected === index ? 'ecosystem-selector is-active' : 'ecosystem-selector'} onClick={() => setSelected(index)}><span>{domain.no}</span>{domain.short}</button>)}
        </div>
      </section>
    </Reveal>
  );
}

function DomainCard({ domain }) {
  const Icon = domain.icon;
  const featureTarget = { 'artificial-intelligence': '#ai-feature', blockchain: '#blockchain-feature', web3: '#blockchain-feature', fintech: '#finance-feature', 'real-world-assets': '#finance-feature', 'cloud-infrastructure': '#infrastructure-feature', 'data-engineering': '#infrastructure-feature', cybersecurity: '#infrastructure-feature', iot: '#connected-systems-feature', 'robotics-automation': '#connected-systems-feature' }[domain.id];
  return (
    <details id={`domain-${domain.id}`} className="technology-domain">
      <summary>
        <div className="domain-summary-top"><span className="domain-number">{domain.no} / TECHNOLOGY DOMAIN</span><Icon className="domain-icon" size={25} strokeWidth={1.35} /></div>
        <h3>{domain.title}</h3>
        <p>{domain.description}</p>
        <span className="domain-expand" aria-hidden="true"><ChevronDown size={19} /></span>
      </summary>
      <div className="domain-details">
        <div className="domain-detail-block"><h4>What it enables</h4><p>{domain.enables}</p></div>
        <div className="domain-detail-block"><h4>Components &amp; concepts</h4><div className="domain-tags">{domain.components.map(item => <span key={item}>{item}</span>)}</div></div>
        <div className="domain-detail-block"><h4>Illustrative use cases</h4><ul>{domain.uses.map(item => <li key={item}>{item}</li>)}</ul></div>
        <div className="domain-detail-block domain-research"><h4>Research &amp; development direction</h4><p>{domain.direction}</p></div>
        <a className="text-link" href={featureTarget}>Explore {domain.short} technology <ArrowRight size={15} /></a>
      </div>
    </details>
  );
}

function DomainLibrary() {
  return (
    <Reveal>
      <section id="technology-domains" className="tech-domain-section">
        <div className="tech-section-head">
          <div><SectionLabel>03 / DEEP TECHNOLOGY EXPLORATION</SectionLabel><h2>Built on ideas.<br /><span>Grounded in engineering.</span></h2></div>
          <p>These are domains OkzByte explores and engineers toward. They describe technical focus areas; they do not imply a production-ready product or commercial deployment in every category.</p>
        </div>
        <div className="domain-grid">{domains.map(domain => <DomainCard domain={domain} key={domain.id} />)}</div>
      </section>
    </Reveal>
  );
}

function ConnectedSystemsFeature() {
  return (
    <Reveal>
      <section id="connected-systems-feature" className="connected-systems-feature">
        <div className="tech-section-head">
          <div><SectionLabel>CONNECTED SYSTEMS / DEVICES &amp; AUTOMATION</SectionLabel><h2>From physical signals<br /><span>to useful actions.</span></h2></div>
          <p>IoT and robotics connect software to the physical world. The diagrams below show general engineering patterns—not deployed OkzByte hardware or automation systems.</p>
        </div>
        <div className="connected-systems-grid">
          <article className="connected-system-card">
            <div className="connected-system-label"><Radio size={19} /><span>09 / INTERNET OF THINGS</span></div>
            <h3>Connected devices</h3>
            <p>Devices and sensors can produce signals that pass through an edge or gateway layer before reaching applications and analytics. Connectivity, device identity, and privacy shape the design.</p>
            <svg className="connected-diagram" viewBox="0 0 560 142" role="img" aria-label="Conceptual IoT flow from sensor through gateway and network to application">
              <path d="M88 68h105m73 0h86m74 0h65" fill="none" stroke="rgba(118,245,0,.55)" strokeWidth="1.5" strokeDasharray="4 7" />
              <g fill="#07100a" stroke="#76f500" strokeWidth="1.5"><circle cx="55" cy="68" r="28"/><rect x="193" y="38" width="72" height="60" rx="3"/><path d="M375 47c0-13 11-23 24-23 10 0 18 6 22 14 13-3 26 7 26 21 0 13-10 22-23 22h-27c-12 0-22-9-22-21 0-5 0-9 0-13z"/><rect x="455" y="40" width="70" height="57" rx="3"/></g>
              <g fill="#b6ff63"><circle cx="55" cy="68" r="5"/><circle cx="229" cy="55" r="4"/><circle cx="229" cy="70" r="4"/><circle cx="229" cy="85" r="4"/><circle cx="416" cy="60" r="4"/><circle cx="472" cy="55" r="4"/><circle cx="488" cy="55" r="4"/><circle cx="504" cy="55" r="4"/></g>
              <g fill="#929e95" fontSize="9" fontFamily="DM Mono,monospace" textAnchor="middle"><text x="55" y="125">SENSOR</text><text x="229" y="125">EDGE / GATEWAY</text><text x="411" y="125">NETWORK</text><text x="490" y="125">APPLICATION</text></g>
            </svg>
            <div className="device-topic-list"><span>Telemetry</span><span>Device identity</span><span>Edge processing</span><span>Connectivity</span></div>
          </article>
          <article className="connected-system-card">
            <div className="connected-system-label"><Bot size={19} /><span>10 / ROBOTICS &amp; AUTOMATION</span></div>
            <h3>Automation with oversight</h3>
            <p>Robotic and automated workflows bring together sensing, planning, control, and feedback. Safe deployment requires testing, clear operating limits, and human oversight.</p>
            <svg className="connected-diagram" viewBox="0 0 560 142" role="img" aria-label="Conceptual robotics control loop with perception, planning, action, and feedback">
              <path d="M90 74h87m70 0h82m72 0h77M481 83C481 115 416 118 347 118H201C133 118 76 114 76 86" fill="none" stroke="rgba(118,245,0,.55)" strokeWidth="1.5" strokeDasharray="4 7"/>
              <g fill="#07100a" stroke="#76f500" strokeWidth="1.5"><rect x="28" y="45" width="62" height="55" rx="3"/><rect x="177" y="45" width="70" height="55" rx="3"/><rect x="329" y="45" width="70" height="55" rx="3"/><rect x="471" y="45" width="62" height="55" rx="3"/></g>
              <g fill="#b6ff63"><circle cx="58" cy="64" r="5"/><circle cx="49" cy="79" r="3"/><circle cx="67" cy="79" r="3"/><circle cx="212" cy="62" r="4"/><circle cx="228" cy="62" r="4"/><circle cx="363" cy="58" r="4"/><circle cx="363" cy="75" r="4"/><circle cx="363" cy="90" r="4"/><circle cx="502" cy="61" r="4"/><circle cx="516" cy="75" r="4"/></g>
              <g fill="#929e95" fontSize="9" fontFamily="DM Mono,monospace" textAnchor="middle"><text x="59" y="127">PERCEIVE</text><text x="212" y="127">PLAN</text><text x="364" y="127">CONTROL</text><text x="502" y="127">ACT &amp; REVIEW</text></g>
            </svg>
            <div className="device-topic-list"><span>Control systems</span><span>Task planning</span><span>Simulation</span><span>Human-in-the-loop</span></div>
          </article>
        </div>
        <p className="connected-footnote">CONCEPTUAL ENGINEERING PATTERNS / NOT A DEPLOYED PRODUCT CLAIM</p>
      </section>
    </Reveal>
  );
}

function TechFeature({ number, id, label, title, text, visual, children, className = '' }) {
  return (
    <Reveal>
      <section id={id} className={`tech-feature ${className}`}>
        <div className="tech-feature-copy">
          <SectionLabel>{number} / {label}</SectionLabel>
          <h2>{title}</h2>
          <p>{text}</p>
          {children}
        </div>
        <div className="tech-feature-visual"><TechEcosystemScene variant={visual} label={`${label} conceptual three-dimensional visualization`} /><span className="visual-caption">CONCEPTUAL VISUALIZATION / NOT LIVE SYSTEM DATA</span></div>
      </section>
    </Reveal>
  );
}

function IntelligenceFeature() {
  return (
    <TechFeature number="04" id="ai-feature" label="INTELLIGENCE ENGINEERING" title="Human-centred intelligence. Engineered with care." text="We explore how generative AI, large language models, machine learning, intelligent agents, and AI-powered business automation can assist people and digital workflows. Topics include model optimization, inference, AI infrastructure, evaluation, and meaningful human–AI interaction. These are areas of exploration—not claims of a live OkzByte inference service or production deployment." visual="neural" className="tech-feature-ai">
      <div className="feature-topic-list"><span>Generative AI &amp; LLMs</span><span>Agents &amp; workflows</span><span>Machine learning</span><span>Inference &amp; optimization</span><span>Human oversight</span></div>
      <a className="initiative-link" href="https://huggingface.co/FaisalOrakzai/OrakzaiX" target="_blank" rel="noreferrer"><span>RELATED AI MODEL INITIATIVE / INDEPENDENT PROJECT</span><strong>OrakzaiX</strong><p>Open its project page on Hugging Face. No ownership, operational, or technical integration relationship with OkzByte is asserted here.</p><ArrowUpRight size={17} /></a>
    </TechFeature>
  );
}

function BlockchainFeature() {
  return (
    <TechFeature number="05" id="blockchain-feature" label="DECENTRALIZED ENGINEERING" title="Transparent systems. Explicit trust boundaries." text="Distributed ledgers and decentralized architectures offer different ways to coordinate shared state and programmable rules. Their application requires careful choices around security, privacy, governance, and user control. The animation is a conceptual network illustration; it does not depict transactions or a live chain." visual="blockchain" className="tech-feature-reverse">
      <div className="feature-topic-list"><span>Smart-contract architecture</span><span>Distributed ledgers</span><span>Tokenization patterns</span><span>Interoperability</span><span>Wallets &amp; on-chain data</span><span>Zero-knowledge concepts</span></div>
      <p className="feature-note"><ShieldCheck size={17} /> Security, transparency, and decentralization involve design trade-offs; no particular network or protocol deployment is implied.</p>
    </TechFeature>
  );
}

function FinanceFeature() {
  return (
    <TechFeature number="06" id="finance-feature" label="FINANCIAL TECHNOLOGY & RWA" title="Digital value needs dependable foundations." text="Financial technology spans digital financial infrastructure, payment integration architecture, transaction processing, financial software, and secure account or wallet connections. Real-world-asset technology adds digital representation, tokenization patterns, asset records, and lifecycle concepts. These are conceptual technology areas—not an investment offering, regulated financial product, or return promise." visual="finance" className="tech-feature-finance">
      <div className="finance-topic-grid"><div><span>FINTECH</span><p>Integrations · transaction flows · financial software</p></div><div><span>REAL-WORLD ASSETS</span><p>Representation · tokenization · lifecycle records</p></div></div>
      <p className="feature-note"><Landmark size={17} /> Legal, custody, ownership, and regulatory requirements depend on the specific asset and jurisdiction.</p>
    </TechFeature>
  );
}

function InfrastructureFeature() {
  return (
    <TechFeature number="07" id="infrastructure-feature" label="CLOUD, DATA & CYBERSECURITY" title="Infrastructure designed for clarity and resilience." text="Cloud-native architecture, distributed systems, APIs, databases, data pipelines, authentication, encryption concepts, application security, deployment, and monitoring are interconnected engineering concerns. The visualization is conceptual and does not represent OkzByte production infrastructure." visual="infrastructure" className="tech-feature-reverse tech-feature-infrastructure">
      <div className="infra-flow"><span>APPLICATIONS</span><i /><span>APIs &amp; SERVICES</span><i /><span>DATA &amp; COMPUTE</span><i /><span>SECURITY &amp; OBSERVABILITY</span></div>
      <a className="text-link" href="/solutions">Explore solutions <ArrowUpRight size={15} /></a>
    </TechFeature>
  );
}

function ArchitectureSection() {
  const [selected, setSelected] = useState(0);
  return (
    <Reveal>
      <section id="technology-architecture" className="tech-architecture">
        <div className="tech-section-head"><div><SectionLabel>08 / TECHNOLOGY INTEGRATION ARCHITECTURE</SectionLabel><h2>Systems connect<br /><span>one layer at a time.</span></h2></div><p>Conceptual architecture. This illustrates how technology domains can work together; it is not a representation of a deployed OkzByte system.</p></div>
        <div className="architecture-layout">
          <div className="architecture-stack" role="tablist" aria-label="Conceptual technology architecture layers">
            {layers.map((layer, index) => <button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'architecture-layer is-active' : 'architecture-layer'} key={layer.title} onClick={() => setSelected(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{layer.title}</strong><ArrowRight size={16} /></button>)}
          </div>
          <div className="architecture-inspector" role="tabpanel"><div className="inspector-index">CONCEPTUAL LAYER / {String(selected + 1).padStart(2, '0')}</div><h3>{layers[selected].title}</h3><p>{layers[selected].detail}</p><div className="architecture-signal"><span /><span /><span /><span /><span /></div><small>ILLUSTRATIVE SYSTEM RELATIONSHIP</small></div>
        </div>
      </section>
    </Reveal>
  );
}

function ResearchSection() {
  return (
    <Reveal>
      <section className="tech-research-section">
        <div className="research-number">R&amp;D / 001</div>
        <div><SectionLabel>09 / RESEARCH &amp; DEVELOPMENT</SectionLabel><h2>Exploring beyond<br /><span>today's technology.</span></h2><p>Technology moves forward through research, experimentation, and continuous engineering. OkzByte is focused on exploring emerging technical possibilities and understanding how new architectures can create practical digital solutions.</p></div>
        <div className="research-theme-list"><span>Advanced AI architectures</span><span>Distributed &amp; decentralized systems</span><span>Cross-chain interoperability</span><span>Digital asset infrastructure</span><span>Intelligent automation</span><span>Scalable computing systems</span><a className="text-link" href="/research">Visit Research <ArrowUpRight size={15} /></a></div>
      </section>
    </Reveal>
  );
}

function TechnologyApproach() {
  return (
    <Reveal>
      <section className="tech-principles">
        <SectionLabel>10 / WHY OUR TECHNOLOGY APPROACH</SectionLabel><h2>Complexity with<br /><span>clear principles.</span></h2>
        <div className="tech-principle-grid">{principles.map(({ title, text, icon: Icon }, index) => <article key={title}><span className="tech-principle-no">0{index + 1}</span><Icon size={22} strokeWidth={1.35} /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
    </Reveal>
  );
}

export default function TechnologiesPage() {
  return (
    <main className="technologies-page">
      <TechnologyHero />
      <EcosystemSection />
      <DomainLibrary />
      <IntelligenceFeature />
      <BlockchainFeature />
      <FinanceFeature />
      <InfrastructureFeature />
      <ConnectedSystemsFeature />
      <ArchitectureSection />
      <ResearchSection />
      <TechnologyApproach />
      <section className="tech-final-cta"><SectionLabel>LET'S ENGINEER WHAT'S NEXT</SectionLabel><h2>Technology is only<br /><span>the beginning.</span></h2><p>Have a technical challenge or an idea worth exploring? Start a conversation with OkzByte.</p><div><a className="button button-primary" href="/contact">Discuss a Technology Project <ArrowUpRight size={16} /></a><a className="text-link" href="/products">Explore products <ArrowRight size={15} /></a><a className="text-link" href="/about">About OkzByte <ArrowRight size={15} /></a></div></section>
    </main>
  );
}
