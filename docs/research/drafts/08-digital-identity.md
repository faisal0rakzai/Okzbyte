# Digital Identity and Verifiable Credentials in the Web3 Era

## Portable proof, selective disclosure, and the governance that makes trust usable

> **DRAFT — EDITORIAL REVIEW.** This is original editorial analysis, not a peer-reviewed article. Standards descriptions below are established facts from cited specifications; the proposed architecture and recommendations are the author’s analysis, not a formally validated standard.

## Abstract

Web3 identity is often framed as a contest between centralized accounts and user-controlled identifiers. That framing obscures the harder engineering problem: how can a verifier assess an assertion without collecting unnecessary data, while determining whether the issuer, cryptographic proof, credential status, and applicable rules are trustworthy? Decentralized identifiers (DIDs) and verifiable credentials (VCs) provide interoperable data models and cryptographic mechanisms for parts of this problem, but they do not by themselves establish a real-world identity, guarantee privacy, or create common governance. This article distinguishes identifier control from credential trust, examines verification and selective disclosure, and proposes a layered architecture joining wallets, proof formats, status checking, and ecosystem policy. It argues that deployment quality depends as much on minimizing linkability and agreeing on issuer semantics as on cryptographic correctness.

## Introduction

A blockchain address can prove control of a private key. It cannot, on its own, prove that its controller is a licensed nurse, an adult, or the same person who received an earlier credential. Connecting claims about people to cryptographic systems therefore requires more than assigning an address or putting personal data on-chain.

W3C’s DID and VC specifications offer a standards-based way to represent identifiers, issuer assertions, and presentations. Their value is not that they eliminate institutions, but that they can make claims portable and machine-verifiable across applications. The challenge is preserving portability without turning presentations into tracking events.

## Background and technical context

A DID is a URI-form identifier whose method determines how it is created, resolved, updated, and deactivated. A resolver obtains a DID document containing verification methods and purpose relationships, such as authentication. DID Core leaves operations to individual methods; shared syntax does not imply shared security, governance, or availability. [1]

A VC is a data model for claims and metadata, accompanied by a means of checking integrity and issuer attribution. An issuer makes a claim, a holder stores or presents it, and a verifier evaluates the presentation. A signature or proof can show data integrity and connect it to an issuer key; it does not prove the issuer’s authority, the quality of underlying evidence, or that a claim remains current. [2]

Verification is a chain of decisions. A verifier validates the proof and cryptosuite, identifies the issuer and key, interprets claims, checks validity and status, and applies policy. DID resolution is not issuer trust: a DID document can provide key material without certifying an organization’s competence or authority. NIST’s Digital Identity Guidelines likewise treat proofing, authentication, and federation as separate areas with risk-based security and privacy requirements; the guidelines are a useful reminder that a portable credential format is not a complete identity assurance program. [3]

## Main analysis: privacy and interoperability are design properties

Selective disclosure addresses data minimization at presentation time. Rather than revealing every attribute in a credential, a holder may reveal only a subset or provide a derived proof. W3C VC Data Model 2.0 describes selective-disclosure approaches and zero-knowledge proof presentations; the standard does not prescribe one universal proof system or make every VC selectively disclosable. [2] IETF RFC 9901 standardizes Selective Disclosure for JSON Web Tokens (SD-JWT), where selectively disclosable claims are represented through hashed disclosures accompanying a signed token. [4]

These mechanisms differ. Claim-level disclosure hides fields, but stable identifiers, issuer-specific signatures, or unusual attribute combinations can link encounters. A zero-knowledge proof may establish a predicate, such as meeting an age threshold, without exposing the value; this requires compatible credentials and correct implementations. “ZK” alone does not guarantee privacy. Retention, logs, issuer callbacks, and repeated identifiers matter too.

Status checking illustrates the tension. Verifiers need to know whether a credential has been suspended or revoked, but a per-credential status URL can reveal to its operator when and where a holder presents it. W3C’s Bitstring Status List Recommendation provides a shared-list mechanism intended to improve privacy and efficiency compared with one-to-one status lookups; the specification itself discusses remaining correlation risks, including small populations and identifiers carried in presentations. [5] Status design, fetch patterns, caching, and disclosed identifiers all influence privacy.

Interoperability is layered: systems may support DIDs yet differ in methods, keys, proof suites, schemas, trust registries, or wallet protocols. Common data models do not resolve these differences. A parser can read a credential without understanding its claims. Governance must define profiles, eligible issuers, assurance, disputes, and migration. Compatibility is necessary; semantic and institutional agreement makes results dependable.

## Proposed framework: a six-layer trust path

The following is an editorial framework, not a W3C or NIST model. It separates responsibilities that are often collapsed under “decentralized identity”:

1. **Subject and key layer:** A person or organization controls wallet-held keys and, where appropriate, one or more DIDs. Key recovery and rotation are explicit lifecycle functions, not assumed properties of a DID.
2. **Issuer and evidence layer:** An accountable issuer checks evidence under published issuance rules and signs claims with scoped keys. The issuer’s authority and process must be discoverable through a trust framework outside the signature itself.
3. **Credential layer:** A credential profile specifies claim meanings, data formats, validity, and the cryptographic securing mechanism. Avoiding global identifiers by default reduces unnecessary cross-context linkage.
4. **Presentation layer:** A wallet negotiates verifier purpose and requested attributes, returns the least revealing adequate proof, and binds it to the verifier’s challenge where the chosen protocol supports that protection.
5. **Verification and status layer:** The verifier checks proof, issuer trust, validity, status, and presentation binding, then records only what its legal and operational purpose requires.
6. **Governance and redress layer:** Named bodies manage issuer accreditation, schema changes, compromised keys, revocation disputes, privacy incidents, and accessible recovery paths.

Cryptography answers whether an assertion was secured under a key; governance answers why it should matter in context. “Decentralized” does not mean “trustless.”

## Practical applications

For education and professional licensing, a graduate could present a signed qualification to an employer without asking the university to answer each query in real time. A wallet could disclose the credential type, issuer, and relevant award while withholding unrelated records. Employment systems would still need a trusted issuer directory, consistent qualification semantics, and a lawful process for status checks.

For age-gated services, a credential-derived predicate could establish that a threshold is met without revealing a full birth date. Such a design is only genuinely privacy-preserving if the proof is unlinkable enough for the use case and the verifier does not demand a stable identifier or retain excess transaction data. In both examples, a VC improves portability; it does not eliminate onboarding, safeguarding, accessibility, or compliance obligations.

## Limitations and challenges

Key loss, theft, coercion, and device compromise remain risks, as do issuer mistakes and fraudulent issuance. Revocation can expose interaction metadata; omitting status checks may hide withdrawn claims. Different suites and DID methods complicate migration and wallet support. Interoperable formats can still carry excessive data.

Wallet-first models can disadvantage people without modern devices, connectivity, technical confidence, or standard identity documents. Institutions need alternatives and recovery. Registries, app stores, infrastructure, governance, and accreditation can remain concentrated.

## Future research

Research should evaluate end-to-end privacy, including linkability across presentations, status retrieval, wallet telemetry, and verifier logs. Interoperability tests should cover method and proof-suite transitions, key compromise, and schema evolution. Governance studies can compare accountability and appeals; implementation studies can test recovery and offline alternatives. These are open research directions.

## Conclusion

DIDs and VCs can make signed claims portable and independently verifiable, while selective disclosure and zero-knowledge techniques can reduce what a holder reveals. Neither feature is sufficient alone. Robust digital identity requires verifiers to assess issuer authority and credential meaning, privacy-aware status mechanisms, interoperable profiles, and accountable governance. The Web3 contribution is best understood not as the removal of trust, but as an opportunity to make trust decisions more portable, inspectable, and proportionate.

**Keywords:** decentralized identifiers; verifiable credentials; digital identity; selective disclosure; zero-knowledge proofs; interoperability; privacy; governance

## Suggested diagrams and visualizations

- **Credential lifecycle and trust path:** Issuer evidence review → signed credential → holder wallet → selective presentation → verifier checks → status and policy decision. Show trust boundaries separately from data flows.
- **Selective-disclosure comparison:** A full credential versus (a) a subset of signed claims and (b) a predicate proof, annotated with what the verifier learns and what can still enable correlation.
- **Governance responsibility map:** A matrix or swimlane showing issuer, wallet, verifier, status-list operator, and ecosystem governance responsibilities for issuance, key rotation, revocation, incident response, and redress.

## References

[1]: https://www.w3.org/TR/did-core/ "Decentralized Identifiers (DIDs) v1.0 — W3C Recommendation, World Wide Web Consortium, 2022"
[2]: https://www.w3.org/TR/vc-data-model-2.0/ "Verifiable Credentials Data Model v2.0 — W3C Recommendation, World Wide Web Consortium, 2025"
[3]: https://pages.nist.gov/800-63-4/ "NIST Special Publication 800-63-4: Digital Identity Guidelines — National Institute of Standards and Technology, 2025"
[4]: https://www.rfc-editor.org/rfc/rfc9901.html "RFC 9901: Selective Disclosure for JSON Web Tokens — IETF, D. Fett et al., 2025"
[5]: https://www.w3.org/TR/vc-bitstring-status-list/ "Bitstring Status List v1.0 — W3C Recommendation, World Wide Web Consortium, 2025"
