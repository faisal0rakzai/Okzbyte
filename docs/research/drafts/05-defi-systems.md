# The Architecture of Modern Decentralized Financial Systems

## Protocol layers, programmable liquidity, external data, and the boundaries of on-chain trust

> **DRAFT / EDITORIAL REVIEW — NOT PEER-REVIEWED.** This is an original editorial analysis for OkzByte Research. It combines established technical facts, attributed to the sources below, with a proposed architecture and analysis clearly labeled as such. It does not report original experiments or claim peer review.

## Abstract

Decentralized finance (DeFi) is not a single application but a system of interacting software, assets, networks, and user interfaces. Its core functions—exchange, lending, collateral management, and derivatives—are encoded in smart contracts and executed against blockchain state. This draft examines the infrastructure beneath those functions: settlement, contract execution, liquidity formation, price oracles, transaction ordering, and operational security. It presents an editorial framework for analyzing a DeFi system across five planes: settlement, protocol, information, risk control, and access. The framework emphasizes that decentralization is not a binary property: each plane can have distinct dependencies and failure modes. It offers architects and auditors a lens for locating guarantees and failure points.

**Keywords:** decentralized finance; DeFi; smart contracts; automated market makers; oracles; settlement; protocol security; composability

## Introduction

Traditional financial services coordinate claims through institutions that maintain accounts, verify instructions, and settle obligations. DeFi shifts parts of that coordination into public distributed ledgers and software. A protocol can accept user transactions, apply rules to shared state, and transfer tokenized value without a conventional central operator. The Bank for International Settlements describes DeFi as a composable, non-custodial ecosystem using distributed-ledger technology, and identifies trading, lending, and investing among its functions [1].

This change relocates rather than removes trust. Users rely on code, ledger consensus and availability, asset issuers, oracle inputs, and interfaces. Analysis must trace the path from instruction to settlement.

## Background and technical context

A smart contract is program code and state deployed at a blockchain address. On Ethereum, a transaction can invoke a contract function; the network validates and executes the transaction, updating shared state according to the contract’s rules [2]. Contracts can call other contracts, enabling composability: one protocol’s output becomes another’s input. This accelerates assembly of services but couples their failure modes.

The BIS’s DeFi stack reference model groups system components into settlement, application, and interface layers [1]. Settlement records transactions and discharges obligations; applications implement financial logic; interfaces mediate user interaction. This is an established classification, not proof that every layer is decentralized; a public-chain application may still depend on a centralized frontend or administrative key.

## Main analysis: tracing the financial system

### Settlement and execution

Settlement is the point at which a financial instruction changes the ledger’s accepted state. It is distinct from a user seeing a pending transaction or a frontend displaying a success message. On Ethereum proof of stake, validators re-execute transactions and vote on blocks; checkpoint finality requires votes representing at least two-thirds of staked ETH [3]. Inclusion, confirmation, and finality are distinct; applications should specify their required assurance and the chain rules that provide it.

Transaction ordering also matters. If multiple operations compete for execution, their sequence can affect prices, liquidations, and arbitrage. Consequently, a protocol’s effective execution environment includes block production and transaction ordering, not just its Solidity source. Congestion can impede correct contracts, and contract-level success does not guarantee external assets or systems.

### Contracts, composability, and liquidity

Contracts define the rules for deposits, swaps, collateral, fees, and withdrawal. Unlike a conventional service backed by discretionary operations, deployed code may be difficult or impossible to alter or reverse. Ethereum’s documentation notes that contract interactions are generally irreversible and that contracts cannot access off-chain information without an oracle [2]. Upgradability and emergency controls can mitigate some problems, but introduce governance and key-management dependencies.

Automated market makers (AMMs) replace a conventional order book with pools of assets against which trades execute. In Uniswap’s constant-product design, pool reserves follow a relationship commonly expressed as *x × y = k*; trades change reserves and thus the implied price, with larger trades relative to pool depth causing greater price impact [4]. Liquidity providers supply paired assets and receive a share of pool economics. Later Uniswap versions allow liquidity to be concentrated in selected price ranges [4]. These choices shape capital efficiency and exposure; pool depth changes as prices move or providers withdraw.

Composing pools with lending, stablecoin, and derivatives contracts creates financial primitives. It also turns dependencies into a graph. A collateral token may depend on a market price; a lending protocol may liquidate against that price; a swap may rely on liquidity that disappears during stress. A local audit cannot evaluate graph-wide risk.

### Oracles and the information boundary

Blockchains can deterministically execute transactions using their own state, but cannot directly observe external events. Oracles convey off-chain data to contracts [2]. Price feeds can be used to value collateral and settle positions; Chainlink’s documentation describes aggregated asset-price and other data published on-chain for contract consumption [5]. Consumers must still validate feed identity and freshness and apply safeguards suitable to their market and chain.

An oracle is a security boundary involving source selection, aggregation, update timing, liveness, and responses to stale or abnormal values. The BIS notes the tension between oracle decentralization, efficiency, and the addition of trusted parties [6]. A nominally decentralized protocol may inherit concentrated information dependencies. For real-world assets, the chain records the reported input; it does not prove the event occurred as reported.

### Security and risk model

**Established facts:** Contract bugs can change or expose funds under the contract’s control, while blockchain consensus and transaction processing have their own assumptions. External feeds add a further dependency [2][3][5]. A multisignature arrangement can require several authorized signers, but it does not eliminate risks from compromised keys, poor governance, or flawed code [2].

**Editorial analysis:** A useful risk register should separate at least six categories: (1) contract logic and upgrade authority; (2) consensus, inclusion, and chain availability; (3) liquidity and market impact; (4) oracle integrity and freshness; (5) asset and issuer solvency or redemption; and (6) interface, wallet, and key custody. Composability makes these risks correlated. For example, a price disruption can prompt liquidations, which move pool prices and create further liquidations. Map controls to failure paths rather than relying on labels such as “audited” or “decentralized.”

## Proposed conceptual framework: five planes

The following is an **original editorial framework**, not a standard or experimentally validated model. It extends the BIS three-layer stack into five analytical planes:

1. **Settlement plane:** ledger, consensus, transaction inclusion, finality, and fees.
2. **Protocol plane:** contracts, token accounting, liquidity, and composable financial rules.
3. **Information plane:** oracle sources, aggregation, freshness, and external-event attestations.
4. **Risk-control plane:** authorization, caps, liquidation logic, circuit breakers, upgrades, and monitoring.
5. **Access plane:** wallets, interfaces, relayers, RPC services, and user disclosures.

For each plane, an architecture review should ask what state it controls, who can change or interrupt it, what happens when it is unavailable, and how failure propagates into adjacent planes. It exposes dependencies without assuming a governance label predicts actual control.

## Practical applications

The framework can guide design reviews, technical due diligence, and incident preparation. Teams can diagram a user transaction from wallet signature through transaction ordering, contract calls, oracle reads, and final settlement. A lending product can document trigger feeds, acceptable data age, and whether liquidations rely on thin markets. A treasury can distinguish ledger finality from token redemption rights. Auditors can connect code findings to upgrade and emergency authorities.

## Limitations and challenges

This analysis is an editorial synthesis, not a protocol audit, legal opinion, or comparative empirical study. Examples use Ethereum and Uniswap and should not be generalized across chains. Project documentation describes intended mechanisms; it does not independently establish that every deployment is secure or decentralized. The proposed checklist’s completeness and predictive value require evaluation. Risk changes with governance, markets, backing, and off-chain providers; static diagrams become incomplete.

## Future research

Further work could operationalize the five-plane review as a dependency graph and test whether it reveals correlated failure paths. Comparative studies could examine settlement and oracle tradeoffs in latency, liveness, and integrity with reproducible methods. Research should examine how governance, interface control, and redemption promises shape understanding of “non-custodial” products. This draft reports no measured outcomes.

## Conclusion

Modern DeFi is a layered financial architecture in which smart contracts automate rules, liquidity pools enable exchange, oracles bridge external information, and a settlement network orders and records outcomes. These components expand programmable coordination, while creating interdependent technical and economic risks. The central question is which component supplies each guarantee, who controls it, and how its failure propagates. Treating settlement, protocol logic, information, risk controls, and access as distinct but connected planes provides a practical starting point for that inquiry.

## Suggested diagrams and visualizations

- **Layered architecture map:** show settlement, protocol, information, risk-control, and access planes, with arrows for assets, calls, and data.
- **Collateral liquidation sequence:** trace price-feed update → health-factor calculation → liquidation transaction → pool trade → settlement, marking possible delays and failure points.
- **Dependency and control graph:** nodes for contracts, feeds, chain, admin keys, and frontend; annotate each edge with who operates it and its fallback behavior.

## References

[1] Raphael Auer, Bernhard Haslhofer, Stefan Kitzler, Pietro Saggese, and Francesco Victor, “The Technology of Decentralized Finance (DeFi),” Bank for International Settlements, BIS Working Papers No. 1066, 2023. https://www.bis.org/publications/working-paper-1066-technology-decentralized-finance-defi

[2] “Introduction to smart contracts,” Ethereum.org, official Ethereum developer documentation, https://ethereum.org/developers/docs/smart-contracts/

[3] “Proof-of-stake (PoS),” Ethereum.org, official Ethereum developer documentation, https://ethereum.org/developers/docs/consensus-mechanisms/pos/

[4] “How Uniswap Works,” Uniswap Developers, official documentation, https://developers.uniswap.org/docs/get-started/concepts/how-uniswap-works

[5] “Data Feeds,” Chainlink Documentation, official project documentation, https://docs.chain.link/data-feeds

[6] Leonardo Gambacorta, Rodney Garratt, and Priscilla Koo Wilkens, “The oracle problem and the future of DeFi,” Bank for International Settlements, BIS Bulletin No. 76, 2023. https://www.bis.org/publications/bulletin-76-oracle-problem-and-future-defi
