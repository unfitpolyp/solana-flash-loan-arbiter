import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { FlashLoanEngine } from "../src/flash-loan-engine";
import { FlashLoanConfig, ArbitrageHop } from "../src/types";

async function main() {
  console.log("Initializing Solana Flash Loan Arbiter engine...");

  const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
  const engine = new FlashLoanEngine(connection);
  const operator = Keypair.generate();

  const SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");
  const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

  // 100 SOL Flash Loan from Kamino (0.09% fee)
  const flashConfig: FlashLoanConfig = {
    protocol: "Kamino",
    poolAddress: Keypair.generate().publicKey,
    borrowMint: SOL_MINT,
    borrowAmount: 100_000_000_000n, // 100 SOL
    feeBps: 9, // 0.09%
  };

  const sampleHops: ArbitrageHop[] = [
    {
      dexName: "Orca Whirlpools",
      inputMint: SOL_MINT,
      outputMint: USDC_MINT,
      expectedOutputAmount: 15_200_000_000n, // 15,200 USDC
      minOutputAmountWithSlippage: 15_150_000_000n,
    },
    {
      dexName: "Raydium CLMM",
      inputMint: USDC_MINT,
      outputMint: SOL_MINT,
      expectedOutputAmount: 100_250_000_000n, // 100.25 SOL
      minOutputAmountWithSlippage: 100_180_000_000n,
    },
  ];

  console.log("Evaluating candidate multi-hop swap route...");
  const opportunity = engine.evaluateOpportunity(
    flashConfig,
    100_250_000_000n,
    sampleHops
  );

  if (opportunity) {
    console.log("Profitable Opportunity Detected!");
    console.log(`- Borrow Amount: ${Number(opportunity.borrowAmount) / 1e9} SOL`);
    console.log(`- Gross Profit: ${Number(opportunity.expectedGrossProfit) / 1e9} SOL`);
    console.log(`- Flash Loan Fee: ${Number(opportunity.flashLoanFeeAmount) / 1e9} SOL`);
    console.log(`- Net Profit: ${Number(opportunity.netProfit) / 1e9} SOL`);

    console.log("Executing atomic flash loan arbitrage transaction...");
    const result = await engine.executeArbitrage(opportunity, operator);
    console.log(`Execution Confirmed in Slot ${result.blockSlot}`);
    console.log(`Signature: ${result.signature}`);
  }
}

main().catch(console.error);
