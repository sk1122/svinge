import cron from 'node-cron'
import { store } from '../store'

import { Blockchain, defaultRPC, RPC, RPCRequest } from "../types"
import { batchRequest } from '../utils/batchRequest'

export class BaseLoadBalancer {
    public rpcs: RPC[] = []
    public blockchain: Blockchain = Blockchain.ETHEREUM
    public currentRPC: RPC = defaultRPC("", this.blockchain)
    public cronTask: cron.ScheduledTask | undefined = undefined

    constructor(rpcs: RPC[], blockchain: Blockchain) {
        this.rpcs = rpcs
        this.blockchain = blockchain

        // this.checkRPCHealth()
    }

    nextRPC(method: string): RPC {
        let notDownRpcs = this.rpcs.filter(rpc => !rpc.down)

        let sortedRpcs = notDownRpcs.sort((a, b) => a.avgResponse - b.avgResponse)
        
        if(sortedRpcs.length > 0) {
            this.currentRPC = sortedRpcs[0]
            let i = 1;

            while(this.currentRPC.notSupportedMethods.includes(method)) {
                if(i >= sortedRpcs.length) throw new Error(`No RPC supports ${method}`)
                this.currentRPC = sortedRpcs[i]
                i++
            }
        } else {
            this.currentRPC = this.rpcs[0]
        }

        return this.currentRPC
    }

    async storeResult() {
        let success = false
        while(!success) {
            try {
                await store(this.blockchain, this.rpcs)
                success = true
            } catch (e) {
                success = false
            }
        } 
    }

    async request(request: RPCRequest): Promise<RPCRequest> {
        try {
            const rpc = this.nextRPC(request.method)
            
            let response = await batchRequest([rpc], request)
            let previousRPCs: any = {}
    
            while(response[0].error) {
                const rpc = this.nextRPC(request.method)
    
                if(previousRPCs[rpc.url]) continue
    
                response = await batchRequest([rpc], request)
    
                previousRPCs[response[0].rpc.url] = true
                
                const newRPC = {
                    ...response[0].rpc,
                    notSupportedMethods: [...response[0].rpc.notSupportedMethods, request.method]
                } as RPC
    
                this.updateRPC(newRPC)
            }
    
            this.updateRPC(response[0].rpc)
    
            this.storeResult()
    
            if(response[0].response) {
                return response[0].response
            } else {
                const newRPC = {
                    ...response[0].rpc,
                    notSupportedMethods: [...response[0].rpc.notSupportedMethods, request.method]
                } as RPC
    
                this.updateRPC(newRPC)
                throw response[0].error
            }
        } catch (e) {
            throw {
                jsonrpc: '2.0',
                error: { code: -32042, message: 'Method not supported' },
                id: '1'
            }
        }
    }

    checkRPCHealth(override = false) {
        throw new Error("Please override it")
    }

    async defaultRequest(): Promise<{ rpc: RPC, result?: any, error?: any }[]> {
        throw new Error("Please override it")
    }

    private updateRPC = (rpc: RPC) => {
        const index = this.rpcs.findIndex(x => x.url.toLowerCase() === rpc.url.toLowerCase())

        this.rpcs[index] = rpc
    }
} 

export * from "./ethereum"
export * from "./solana"