import { BaseLoadBalancer } from ".";
import { Blockchain, RPC, RPCRequest } from "../types";
import { batchRequest } from "../utils/batchRequest";

export class Solana extends BaseLoadBalancer {
    constructor(rpcs: RPC[]) {
        super(rpcs, Blockchain.SOLANA)
    }

    override async defaultRequest(): Promise<{ rpc: RPC, result?: any, error?: any }[]> {
        let rpcRequest: RPCRequest = {
            method: 'getVersion',
            params: [],
            start: new Date()
        }

        let result = await batchRequest(this.rpcs, rpcRequest)

        return result
    }
}