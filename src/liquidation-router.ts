import { Connection, PublicKey } from "@solana/web3.js";
import Decimal from "decimal.js";

export interface LiquidationTarget {
  obligationAddress: PublicKey;
  borrowedAssetMint: PublicKey;
  collateralAssetMint: PublicKey;
  repayAmount: bigint;
  expectedCollateralReward: bigint;
  healthFactor: Decimal;
}

export class LiquidationRouter {
  constructor(private connection: Connection) {}

  /**
   * Identifies if an obligation health factor is below liquidation threshold (< 1.0)
   */
  public isLiquidatable(healthFactor: Decimal): boolean {
    return healthFactor.lt(1.0);
  }

  /**
   * Calculates liquidation incentive bonus return
   */
  public calculateLiquidationReward(
    repayAmount: bigint,
    bonusBps: number
  ): bigint {
    const bonus = (repayAmount * BigInt(bonusBps)) / 10_000n;
    return repayAmount + bonus;
  }
}
