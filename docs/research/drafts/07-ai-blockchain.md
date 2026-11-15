# AI and Blockchain Convergence: Toward Verifiable Intelligent Systems

*From opaque model claims to evidence-linked computation, provenance, and accountable deployment*

> **DRAFT — EDITORIAL REVIEW.** This is an original editorial analysis, not a peer-reviewed research article. It distinguishes established standards and published work from the proposed framework below.

## Abstract

Artificial intelligence systems increasingly depend on data, models, accelerators, and services operated by parties that do not fully trust one another. Blockchains can provide shared ordering and tamper-evident records; cryptographic proofs and hardware attestation can provide evidence about computation or execution environments. These mechanisms do not, by themselves, establish that an AI model is fair, safe, accurate, or based on legitimate data. This article examines how they may be combined to make selected claims auditable: model identity and integrity, inference or evaluation, data lineage, privacy controls, and responsibility. It proposes an evidence-linked architecture in which large-scale learning and inference remain off-chain, while compact commitments, attestations, and governance decisions can be independently checked. It also identifies trade-offs in cost, privacy, trust assumptions, and accountability.

## Introduction

AI governance often relies on claims made by the organization that trained, evaluated, or deployed a model. A user may be told which model version was used, what data or safeguards informed it, or how it performed—without having an efficient way to verify those statements. Distributed ledgers offer a common record for parties that need to coordinate, but they are not a substitute for technical evidence. Their useful role is narrower: preserve references to evidence and make changes or attestations detectable over time.

The central question is therefore not whether “AI belongs on-chain,” but which claims can be proven, by whom, and under what assumptions. The analysis below treats standards and published research as established technical context, and the architecture as a proposal for discussion.

## Background and technical context

NIST’s AI Risk Management Framework describes trustworthy AI characteristics including validity and reliability, safety, security and resilience, accountability and transparency, explainability, privacy enhancement, and fairness. It organizes risk work into Govern, Map, Measure, and Manage functions.[1] These are socio-technical outcomes, not properties a blockchain can guarantee. A proof may establish that a specified computation followed a specified circuit; it cannot determine whether its objective or dataset is appropriate.

For provenance, W3C PROV-DM models entities, activities, and agents and the relationships among them. Its purpose includes recording information that can inform assessments of data quality, reliability, and trustworthiness.[2] For execution claims, the IETF Remote ATtestation procedureS architecture separates an Attester that produces Evidence, a Verifier that appraises it under policy, and a Relying Party that uses the resulting Attestation Results.[3] This separation is useful for AI: a measurement is evidence, not a verdict, and the consumer’s policy determines whether it is sufficient.

Verifiable computation addresses another gap. Zero-knowledge proofs can let a prover demonstrate a statement about computation without disclosing the underlying secret witness, although the exact statement and its assumptions matter. A 2024 arXiv paper by South and co-authors describes verifiable model evaluation using zkSNARKs, including proofs tied to model inference and evaluation metrics.[4] Federated learning, meanwhile, keeps training data distributed among clients while updates are aggregated; it does not inherently hide information in updates. Secure aggregation research gives a cryptographic protocol for computing sums of user-held values without revealing each value to the server.[5]

## Main analysis: what convergence can and cannot verify

### Model integrity and verifiable computation

A model identifier is meaningful only if it binds to an exact artifact and relevant configuration. A deployment record might commit to model weights, tokenizer, inference code, runtime configuration, and evaluation inputs using content hashes or a Merkle root. An accompanying signature or hardware-backed attestation can bind a deployment to measured software and hardware states. The RATS model provides a useful vocabulary for separating what an execution environment asserts from how a verifier appraises it.[3]

A proof of inference could then establish that an output was produced by a committed model under a specified computation and input commitment. In practice, modern neural networks can be expensive to prove, and the proof is only as meaningful as the encoded arithmetic, preprocessing, model identity, and verifier implementation. Approximation or quantization inside a proof circuit can also make “same model” ambiguous unless the precise numerical semantics are recorded. The proof verifies a formal relation; it does not establish that the answer is true or appropriate.

### Provenance, accountability, and shared records

A training lineage can be represented as a graph: source dataset versions and licenses feed preprocessing activities; those produce training corpora; training runs produce model artifacts; evaluations and deployments refer to those artifacts. PROV-DM’s entity/activity/agent structure offers a domain-neutral foundation for this graph.[2] An immutable ledger can anchor hashes of signed provenance bundles, timestamps, revocation notices, or evaluation attestations. Detailed documents and sensitive content can remain in controlled storage. Such records make alteration detectable, not the original entry truthful: a contributor can sign a false claim, and a ledger cannot observe off-chain events. Accountability still needs roles, policies, dispute processes, and correction routes; technical traceability supports but cannot replace institutional accountability.[1]

### Decentralized AI and privacy-preserving AI

“Decentralized AI” may mean distributed training, independent hosting, shared governance, or marketplace coordination; these are not equivalent. Federated learning distributes data but may retain a coordinating server.[5] Secure aggregation can conceal individual updates under its assumptions, but does not prevent leakage from aggregates, malicious clients, or model outputs.[5] A ledger can coordinate membership and audit checkpoints, while publishing detailed provenance or updates may expose sensitive information.

Privacy-preserving computation offers complementary tools. NIST’s Privacy-Enhancing Cryptography program describes zero-knowledge proofs, secure multiparty computation, and fully homomorphic encryption as techniques for enabling useful interaction while limiting disclosure.[6] ZK proofs substantiate statements; MPC computes jointly over private inputs; homomorphic encryption supports computation over ciphertexts. Differential privacy is distinct and can limit individual influence in released statistics or models. Protections should match the threat model; neither a ledger nor a proof is a general privacy shield.

## Proposed framework: an evidence-linked AI lifecycle

**The following is the article’s proposed analysis, not an established standard.** A practical architecture would have five connected layers:

1. **Artifact and lineage layer:** content-addressed identities for datasets, code, model weights, configurations, and evaluation packages; signed provenance edges identify responsible agents and transformations.
2. **Execution-evidence layer:** hardware or software attestations bind a run to a measured environment; proof systems establish narrowly specified facts about inference or evaluation where feasible.
3. **Private-computation layer:** federated protocols, secure aggregation, MPC, FHE, or differential privacy are selected according to who must learn which inputs and outputs.
4. **Evidence registry:** an append-only ledger or equivalent shared registry anchors commitments and policy events. Smart contracts can automate small, deterministic coordination rules, but large AI workloads and sensitive payloads remain off-chain. Ethereum’s documentation notes that smart contracts execute on-chain and cannot directly retrieve real-world data without an oracle.[7]
5. **Decision and redress layer:** independent verifiers appraise evidence against published policies; deployers record decisions, exceptions, incidents, and correction or appeal paths. A cryptographically valid credential or attestation does not imply its claims are true or sufficient—a distinction also explicit in W3C’s Verifiable Credentials model.[8]

This modular design may use a permissioned registry or public-chain commitments. Either way, trust roots, key rotation, data retention, verifier independence, and dispute handling must be defined.

## Practical applications

A regulated buyer could request an attestation linking a deployed model hash to evaluation results and check that the endpoint runs the approved version. In collaborative health research, institutions could retain local records, aggregate updates securely, and publish signed summaries and protocol commitments. A model marketplace could expose provenance credentials while restricting confidential details. The result is an inspectable claim, not “trustless AI.”

## Limitations and challenges

Proof generation can be expensive for large models. Attestation says little about behavior outside a measured environment or after compromise; hashes establish identity, not data quality or usage rights. Public ledgers raise privacy and retention issues, while oracles reintroduce trusted operators. Decentralization can diffuse responsibility unless owners of objectives, deployment, and remediation are explicit. Verification needs independent evaluation, access controls, legal review, and appropriate human oversight.

## Future research

Priorities include lower-cost proofs for realistic inference and training, provenance formats that link artifacts to licenses and policies, and attestation policies that clearly state evidentiary limits. Evaluations should measure privacy leakage, proving overhead, verifier diversity, and recovery under realistic threat models. Revocation and correction should preserve audit history without presenting old claims as current.

## Conclusion

AI and blockchain convergence is most credible when it is framed as evidence engineering rather than a promise that decentralization creates trust. Standards for provenance and attestation, along with work on verifiable computation and privacy-preserving collaboration, provide pieces of a system that can make selected AI claims easier to inspect. The remaining work is architectural and institutional: bind evidence to exact artifacts, preserve privacy, define who appraises it, and retain clear responsibility when systems fail.

**Keywords:** artificial intelligence; blockchain; verifiable computation; model integrity; data provenance; remote attestation; federated learning; privacy-preserving AI; accountability

## Suggested diagrams and visualizations

- **Evidence-flow architecture:** show model/data artifacts and off-chain execution on the left; attestations and proofs flowing to independent verifiers; a ledger anchoring commitments; relying parties applying their own policies.
- **AI provenance graph:** depict dataset versions, preprocessing activities, training runs, model hashes, evaluations, and deployments as PROV-style entities, activities, and agents.
- **Claim-to-evidence matrix:** contrast claims such as “this is model version X,” “this output followed the model,” and “this model is fair” with the distinct evidence and residual judgment each requires.

## References

[1] National Institute of Standards and Technology (NIST). *Artificial Intelligence Risk Management Framework (AI RMF 1.0).* NIST AI 100-1, 2023. https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf

[2] Luc Moreau and Paolo Missier, eds. *PROV-DM: The PROV Data Model.* W3C Recommendation, World Wide Web Consortium (W3C), 2013. https://www.w3.org/TR/prov-dm/

[3] H. Birkholz, D. Thaler, M. Richardson, N. Smith, and W. Pan. *Remote ATtestation procedureS (RATS) Architecture.* RFC 9334, Internet Engineering Task Force (IETF), 2023. https://www.rfc-editor.org/rfc/rfc9334.html

[4] T. South, A. Camuto, S. Jain, S. Nguyen, R. Mahari, et al. *Verifiable Evaluations of Machine Learning Models Using zkSNARKs.* arXiv:2402.02675, 2024. https://arxiv.org/abs/2402.02675

[5] K. Bonawitz, V. Ivanov, B. Kreuter, et al. *Practical Secure Aggregation for Federated Learning on User-Held Data.* arXiv:1611.04482, 2016. https://arxiv.org/abs/1611.04482

[6] NIST. *Privacy-Enhancing Cryptography.* Computer Security Resource Center, NIST, updated 2026. https://csrc.nist.gov/projects/pec

[7] Ethereum.org. *Introduction to Smart Contracts.* Ethereum Foundation/community documentation, n.d. https://ethereum.org/en/developers/docs/smart-contracts/

[8] Manu Sporny, Dave Longley, and David Chadwick, eds. *Verifiable Credentials Data Model v2.0.* W3C Recommendation, World Wide Web Consortium, 2025. https://www.w3.org/TR/vc-data-model-2.0/
