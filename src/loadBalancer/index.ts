import { Blockchain, RPC } from "../types"

export class BaseLoadBalancer {
    public rpcs: RPC[] = []
    
    constructor(rpcs: string[], blockchain: Blockchain) {
        rpcs.map(rpcUrl => {
            let rpc: RPC = {
                avgResponse: 0,
                blockchain: blockchain,
                failedRequest: 0,
                name: rpcUrl,
                url: rpcUrl,
                requestServed: 0,
                requestServing: 0,
                responses: [],
                weight: 0
            }

            this.rpcs.push(rpc)
        })
    }

    nextURL(): RPC {
        return this.rpcs[0]
    }

    storeResult(): boolean {
        return true
    }
} 

export * from "./ethereum"
export * from "./solana"