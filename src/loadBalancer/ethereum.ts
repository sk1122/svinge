import cron from 'node-cron'
import { BaseLoadBalancer } from ".";
import { Blockchain, CacheConfig, RPC, RPCRequest } from "../types";
import { batchRequest } from "../utils/batchRequest";

export class Ethereum extends BaseLoadBalancer {
    constructor(rpcs: RPC[], cache?: CacheConfig) {
        super(rpcs, Blockchain.ETHEREUM, cache)

        this.checkRPCHealth()
    }

    override checkRPCHealth(override = false) {
        if(!override && this.cronTask) return

        this.cronTask = cron.schedule('* * * * *', async () => {
            console.log("starting health check")
            const response = await this.defaultRequest()

            response.map(response => {
                let index = this.rpcs.findIndex(x => x.url.toLowerCase() === response.rpc.url.toLowerCase())
                
                if(response.error && !response.result) {
                    this.rpcs[index].down = true
                }

                if(response.result && !response.error) {
                    this.rpcs[index].down = true
                }
            })

            console.log("finished health check")
        })
    }

    override async defaultRequest(): Promise<{ rpc: RPC, result?: any, error?: any }[]> {
        let rpcRequest: RPCRequest = {
            method: 'eth_chainId',
            params: [],
            start: new Date()
        }
        
        let result = await batchRequest(this.rpcs, rpcRequest)
        
        return result
    }
}