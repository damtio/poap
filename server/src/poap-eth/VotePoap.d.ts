/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction } from "ethers";
import { TransactionOverrides } from ".";

export class VotePoap extends Contract {
  functions: {

    relayedVote(
      _address: string,
      _proposal: number,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  }

}
