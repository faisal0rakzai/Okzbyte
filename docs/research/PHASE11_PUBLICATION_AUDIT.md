# OkzByte Research — Phase 11 Publication Audit

**Audit date:** 2026-11-15
**Researcher:** Faisal Orakzai
**Supplied ORCID:** [0009-0000-0915-7272](https://orcid.org/0009-0000-0915-7272)

## Corrected archive finding

The official research page is a dynamic, filterable archive. Its visible **“All Intel” counter says 25**. The category tabs show Artificial Intelligence (1), Market Knowledge (12), Blockchain (10), Artifacts & Blueprints (3), Cryptographic White Papers (5), and Production Code (4). The rendered page exposes overlapping categories and a card/counter reconciliation question, so 25 is the site's displayed index count—not a verified count of distinct publications. Do not sum category totals or infer academic publication counts from these counters.

The archive shows ten long-form blockchain explainer cards, a separately featured cross-chain white-paper card, market-analysis cards, protocol and project blueprints, cryptographic white-paper cards, and production-code entries. Therefore, the displayed counter does not mean “25 academic papers.” Many entries show no DOI, journal, venue, or independently resolvable repository record. Several marked as drafts or blueprints are not published research papers. We should preserve the archive's own status labels and reconcile its index count against the rendered cards before importing each item.

### Ten blockchain explainers visible in the official archive

1. *What is Blockchain? A Complete Beginner's Guide* — [official article](https://faisalorakzai.com/research/blockchain-basic)
2. *Blockchain Infrastructure Explained* — [official article](https://faisalorakzai.com/research/blockchain-infra)
3. *Cross-Chain Technology Explained* — archive card present; the candidate article path tested during this audit returned “Article not found.”
4. *How Digital Identity Works on Blockchain* — [official article](https://faisalorakzai.com/research/blockchain-digital-identity)
5. *The Future of Web3 Infrastructure* — [official article](https://faisalorakzai.com/research/future-of-web3)
6. *Blockchain Security & Consensus Mechanisms Explained* — [official article](https://faisalorakzai.com/research/blockchain-security)
7. *Tokenization of Real World Assets (RWA)* — [official article](https://faisalorakzai.com/research/rwa-tokenization)
8. *How Smart Contracts Work* — [official article](https://faisalorakzai.com/research/smart-contracts)
9. *Public vs Private vs Consortium Blockchains* — archive card present; the route found in search results returned unrelated biography/FAQ content, so it needs a correct URL.
10. *Building Enterprise Blockchain Ecosystems* — archive card present; an individual article URL was not confirmed in this audit.

The archive cards attribute these explainers to Faisal Orakzai, label them as 2026 Orakzai Research Lab content, and provide summaries and estimated reading times. These are first-party technical explainers. They should be represented as **official research archive / technical articles**, not described as peer-reviewed papers unless a distinct peer-reviewed record is found.

## Repository and identity checks

| Source | Verified finding | Status for importing into OkzByte |
|---|---|---|
| Zenodo | One confirmed public record: *Cross-Chain Interoperability: Formal Verification and Recursive Zero-Knowledge Architectures for Heterogeneous Distributed Systems*, DOI `10.5281/zenodo.22047129`, dated 2026-08-21. Zenodo classifies it as a **Dataset**, with an open PDF. | FOUND BUT REQUIRES REVIEW |
| ORCID | Three public work groups: the Zenodo dataset above, a blockchain guide DOI `10.2139/ssrn.7236718`, and a verifiable-credential prototype DOI `10.2139/ssrn.7353660`. | FOUND BUT REQUIRES REVIEW |
| SSRN | The two DOI pages listed above are accessible and their displayed metadata/abstracts were inspected. They duplicate ORCID-listed works; they are not two extra works beyond the ORCID count. | FOUND BUT REQUIRES REVIEW |
| ResearchGate | The matching public profile is [Faisal Orakzai](https://www.researchgate.net/profile/Faisal-Orakzai-4); its bio identifies OkzByte and OKBOND. It displays six items, including a repeated blockchain-guide entry and items overlapping Zenodo/SSRN. A six-item platform counter is not six distinct publications. | FOUND BUT REQUIRES REVIEW |
| Official archive | Twenty-five total entries are visible dynamically, including the ten blockchain explainers listed above and non-paper artifacts. Individual metadata/record identifiers are uneven; some candidate article paths tested were unavailable. | FOUND BUT REQUIRES REVIEW |
| Other similar-name profile | [Faisal Moeen Orakzai at Université Libre de Bruxelles](https://www.researchgate.net/profile/Faisal-Orakzai-3) is a different researcher and must not be merged. | VERIFIED exclusion |

### Verified external metadata and cautions

- **Zenodo cross-chain record:** [record 22047129](https://zenodo.org/records/22047129), DOI [10.5281/zenodo.22047129](https://doi.org/10.5281/zenodo.22047129), publication date 2026-08-21, creator “Orakzai, Faisal,” resource type Dataset, open access, file `grounded_cross_chain_final.pdf`. Zenodo displays creator ORCID `0000-0002-1303-4651`, which differs from the supplied ORCID. The supplied ORCID also lists this DOI. Do not silently reconcile the mismatch; request the author's confirmation.
- **Blockchain guide preprint:** [SSRN DOI 10.2139/ssrn.7236718](https://doi.org/10.2139/ssrn.7236718), posted 2026-08-11. The SSRN title is longer than the official-site card title. ResearchGate lists a duplicate of this item; keep one primary record and attach verified source links.
- **Credential prototype preprint:** [SSRN DOI 10.2139/ssrn.7353660](https://doi.org/10.2139/ssrn.7353660), posted 2026-08-27. The abstract explicitly bounds its benchmark to one local environment and says it is not a complete identity network.
- **Books:** The [ResearchGate listing for *The Sovereign Stack*](https://www.researchgate.net/publication/410776532_The_Sovereign_Stack_Engineering_Next-Generation_Blockchain_Infrastructure) identifies a book and says its ISBN is pending. The official site also has a separate Books section listing *The Sovereign Stack* and *I'm Orakzai*; these must stay in Books & Publications, separate from research papers. The subtitle *A Journey Through History, Heritage, and the Future* is supplied in the project brief but is not confirmed by the official index. Publisher identifiers, exact subtitle/edition, and availability require separate verification.
- **Official archive items with non-paper status:** The page visibly labels one OKBOND presentation “BLUEPRINT,” at least two white-paper cards “FORMAL DRAFT,” a platform card “ACTIVE,” and several prototype/code cards. Do not convert status labels such as ACTIVE or BLUEPRINT to PUBLISHED.

## Counts and completeness

- **Zenodo:** 1 relevant record verified directly. This is a count found, not proof of the complete Zenodo author inventory: broad Zenodo search queries returned HTTP 400 during this audit.
- **ResearchGate:** 6 profile entries visible; distinct-work count not settled due to duplicates and overlapping external works.
- **ORCID:** 3 public work groups visible.
- **SSRN:** 2 accessible records checked; both overlap ORCID entries.
- **Official archive:** the site's displayed dynamic index counter is 25; the distinct card count still needs reconciliation. Ten blockchain explainers are individually named above; other visible cards include market analysis, artifacts, white papers, drafts, and code.
- **Imported into a live OkzByte CMS:** 0. No database is configured in this sandbox and no migrations were run. The repository now contains forward-only migrations 006–009 that seed seven individually linked first-party technical explainers, two SSRN preprint records with duplicate ORCID links, a ResearchGate duplicate link attached to the same blockchain preprint, one Zenodo draft held for identity confirmation, six archive-card review drafts, ten new article drafts, a source-aware researcher profile, and separate book rows. These are migration payloads, not live database rows.

## Repository implementation status observed

The repository changes now add a source-aware profile and archive UI, platform filters and source links, public profile/book reads, and a protected `/admin` Research Desk for article editing, review/approval/manual publishing, revisions/events, profile/books editing, source verification, and duplicate merging. Public article APIs still return only `published` items. The application build passes, but database-backed behavior is not confirmed: the sandbox has no `DATABASE_URL`, migrations 006–009 have not been applied, and the CMS has not been exercised against a database.

## Sources inspected

- [Official dynamic research archive](https://faisalorakzai.com/research) (browser-rendered page with 25 entries)
- Official article pages: [blockchain guide](https://faisalorakzai.com/research/blockchain-basic), [infrastructure](https://faisalorakzai.com/research/blockchain-infra), [digital identity](https://faisalorakzai.com/research/blockchain-digital-identity), [Web3 infrastructure](https://faisalorakzai.com/research/future-of-web3), [security and consensus](https://faisalorakzai.com/research/blockchain-security), [RWA tokenization](https://faisalorakzai.com/research/rwa-tokenization), [smart contracts](https://faisalorakzai.com/research/smart-contracts)
- [Zenodo record](https://zenodo.org/records/22047129) and [Zenodo API metadata](https://zenodo.org/api/records/22047129)
- [ORCID public works](https://pub.orcid.org/v3.0/0009-0000-0915-7272/works)
- [SSRN blockchain DOI](https://doi.org/10.2139/ssrn.7236718) and [SSRN credential-prototype DOI](https://doi.org/10.2139/ssrn.7353660)
- [ResearchGate matching profile](https://www.researchgate.net/profile/Faisal-Orakzai-4) and [separately named profile](https://www.researchgate.net/profile/Faisal-Orakzai-3)
- [Official books index](https://faisalorakzai.com/books) and [ResearchGate book item](https://www.researchgate.net/publication/410776532_The_Sovereign_Stack_Engineering_Next-Generation_Blockchain_Infrastructure)

## Remaining review work

- Ask Faisal to resolve the Zenodo creator-ORCID mismatch.
- Capture all 25 archive card titles, stable URLs, and exact source/status links, then validate each record before import. The dynamic page shows all entries; some individual paths are inaccessible or not confirmed.
- Determine which official explainer pages should be mirrored as records versus simply linked as the primary official archive, and confirm reuse/permission expectations before copying full text.
- Confirm complete ResearchGate titles and duplicates from the correct profile; do not bypass restrictions or copy gated full text.
- Verify the books' publisher records/identifiers separately.
- Apply and test database changes in the configured deployment environment.
- Build or connect the protected CMS authoring/review workflow. New articles must remain drafts until a human editor approves them.


## Original article drafts prepared for Phase 11

Ten new, source-cited technical article drafts are stored under [`docs/research/drafts/`](drafts/README.md). The index links every file and labels the entire set **DRAFT CREATED — EDITORIAL REVIEW**. Migration 004 seeds them as draft CMS rows with `published_at=NULL` and no author byline, but those rows do not exist in a live database until that migration is reviewed and applied. See [draft index](drafts/README.md).
