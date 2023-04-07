import { BaseLoadBalancer } from ".";
import { Blockchain } from "../types";

export class Ethereum extends BaseLoadBalancer {
    constructor(rpcs: string[]) {
        super(rpcs, Blockchain.ETHEREUM)
    }
}