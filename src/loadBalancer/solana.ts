import { BaseLoadBalancer } from ".";
import { Blockchain } from "../types";

export class Solana extends BaseLoadBalancer {
    constructor(rpcs: string[]) {
        super(rpcs, Blockchain.SOLANA)
    }
}