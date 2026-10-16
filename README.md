# Solana Flash Loan Arbiter

[![Solana](https://img.shields.io/badge/Solana-Mainnet--Beta-9945FF?logo=solana&logoColor=white)](https://solana.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-yellow.svg)](https://opensource.org/licenses/Apache-2.0)

Sub-second atomic flash loan arbitrage and liquidation routing executor on Solana utilizing Solend, Kamino, and Marginfi lending pools.

Enables zero-capital atomic cross-DEX price discrepancy exploitation, priority compute unit optimization, and instant loan repayment within a single atomic Solana transaction.

---

## 🌟 Key Features

- **Zero-Capital Atomic Flash Loans**: Borrows liquidity from Kamino / Solend lending reserves and executes multi-hop arbitrage routes, reverting atomically if net profit conditions are not met.
- **Dynamic Fee & Gas Deduplication**: Accurately computes exact protocol borrow fees, DEX taker fees, and priority compute unit costs before transaction broadcast.
- **Liquidation Monitoring**: Identifies undercollateralized lending obligations across money markets to route instant liquidation bonus payoffs.
- **Sub-Second Execution**: Streamlined transaction building with Versioned Transactions (v0) and custom lookup table integration.

```mermaid
sequenceDiagram
    autonumber
    actor Bot as Arbiter Engine
    participant Lending as Kamino / Solend Pool
    participant DEX1 as DEX A (e.g. Orca Whirlpool)
    participant DEX2 as DEX B (e.g. Raydium CLMM)
    
    Bot->>Lending: Borrow Flash Loan (e.g. 100 SOL)
    Lending-->>Bot: Transfer Borrowed Funds
    Bot->>DEX1: Swap SOL -> USDC (underpriced venue)
    DEX1-->>Bot: Receive USDC
    Bot->>DEX2: Swap USDC -> SOL (overpriced venue)
    DEX2-->>Bot: Receive 100.25 SOL
    Bot->>Lending: Repay Principal + Fee (100.09 SOL)
    Note over Bot: Retain 0.16 SOL Pure Profit
```

---

## 📂 Project Structure

```text
solana-flash-loan-arbiter/
├── examples/
│   └── execute-arb.ts          # Simulation runner demonstrating profitability checks
├── src/
│   ├── types.ts                # TypeScript interfaces for pools, loans, and hops
│   ├── flash-loan-engine.ts    # Fee calculation and atomic transaction composer
│   ├── liquidation-router.ts   # Collateral health factor evaluator
│   └── index.ts                # Public exports
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md
```

---

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/unfitpolyp/solana-flash-loan-arbiter.git
cd solana-flash-loan-arbiter
npm install
```

### Build

```bash
npm run build
```

### Run Arbitrage Simulation

```bash
npx ts-node examples/execute-arb.ts
```

---

## 📄 License

Licensed under the [Apache License, Version 2.0](LICENSE).
