import { readStore } from "../store";
import { Blockchain, defaultRPC, RPC } from "../types";

export const readConfig = async (rpcUrls: string[], blockchain: Blockchain) => {
    let rpcs: RPC[] = []
    try {
        let store = await readStore(blockchain)
    
        for (let i = 0; i < rpcUrls.length; i++) {
            const rpc = rpcUrls[i]
            let rpcConfig = store.find(s => s.url.toLowerCase() === rpc)
    
            if (!rpcConfig) {
                rpcConfig = defaultRPC(rpc, blockchain)
            }

            rpcConfig.responses = rpcConfig.responses.map(response => {
                if(response.end) response.end = new Date(response.end)
                response.start = new Date(response.start)

                return response
            })
    
            rpcs.push(rpcConfig)
        }
    
        return rpcs
    } catch (e) {
        return rpcUrls.map(x => defaultRPC(x, blockchain))
    }
}