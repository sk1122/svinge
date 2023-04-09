import { Ethereum, Solana } from "./loadBalancer";
import { readStore, setupStore } from "./store";
import { Blockchain, CacheConfig, RPC, RPCRequest } from "./types";
import { batchRequest } from "./utils/batchRequest";
import { readConfig } from "./utils/readConfig";

export class Svinge {
    static balanceEthereum = async (rpcUrls: string[], cache?: CacheConfig) => {
        await setupStore()
        let rpcs = await readConfig(rpcUrls, Blockchain.ETHEREUM)
        
        let rpcRequest: RPCRequest = {
            method: 'eth_chainId',
            params: [],
            start: new Date()
        }

        let result = await batchRequest(rpcs, rpcRequest, cache)
        rpcs = result.map(x => x.rpc)

        return new Ethereum(rpcs, cache)
    }

    static balanceSolana = async (rpcUrls: string[]) => {
        let rpcs = await readConfig(rpcUrls, Blockchain.SOLANA)
        
        let rpcRequest: RPCRequest = {
            method: 'getVersion',
            params: [],
            start: new Date()
        }

        let result = await batchRequest(rpcs, rpcRequest)
        rpcs = result.map(x => x.rpc)

        return new Solana(rpcs)
    }
}