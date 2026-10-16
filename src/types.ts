import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import Decimal from "decimal.js";

export type LendingProtocol = "Solend" | "Kamino" | "Marginfi";

export interface FlashLoanConfig {
  protocol: LendingProtocol;
  poolAddress: PublicKey;
  borrowMint: PublicKey;
  borrowAmount: bigint;
  feeBps: number; // e.g. 9 = 0.09%
}

export interface ArbitrageHop {
  dexName: string;
  inputMint: PublicKey;
  outputMint: PublicKey;
  expectedOutputAmount: bigint;
  minOutputAmountWithSlippage: bigint;
}

export interface ArbitrageOpportunity {
  id: string;
  borrowAmount: bigint;
  expectedGrossProfit: bigint;
  estimatedGasFeeLamports: bigint;
  flashLoanFeeAmount: bigint;
  netProfit: bigint;
  hops: ArbitrageHop[];
  timestamp: number;
}

export interface FlashLoanExecutionResult {
  opportunityId: string;
  signature: string;
  actualNetProfit: bigint;
  executionDurationMs: number;
  blockSlot: number;
}
