import axios from "axios"
import { readCache, storeCache } from "../store";
import { CacheConfig, RPC, RPCRequest } from "../types";
import { calculateAvgResponse } from "./calculateRpcDetail";

export const request = async (rpc: RPC, request: RPCRequest, cacheConfig?: CacheConfig): Promise<{ rpc: RPC, result?: RPCRequest, error?: any }> => {
    console.log("started", rpc.url)
    let requestClone: RPCRequest = {
        ...request,
        start: new Date()
    }

    let cache = await readCache(rpc.blockchain)

    if(cacheConfig && cache[request.method] && cacheConfig.interval > (new Date().getTime() - new Date(cache[request.method].start).getTime())) {
        let cached = cache[request.method]

        let found = true;

        if(cached.params.length != request.params.length) found = false
        else {
            for(let i = 0; i < cached.params.length; i++) {
                if(request.params[i] === cached.params[i]) {
                    found = true
                } else {
                    found = false;
                    break
                }
            }
        }
        
        
        console.log("found => ", found, request.params,cached.params)

        if(found) {
            rpc.responses++
            rpc.requestServed++
            
            return {
                rpc: rpc,
                result: cache[request.method],
                error: undefined
            }
        }
    }

    try {        
        const res = await axios({
            url: rpc.url,
            method: 'POST',
            data: {
                method: request.method,
                params: request.params ?? [],
                jsonrpc: '2.0',
                id: '1'
            },
            timeout: 5000
        })
    
        const data = await res.data

        if(data.error) throw new Error(JSON.stringify(data.error))
    
        requestClone.end = new Date()
        requestClone.result = data

        rpc.totalResponse += (requestClone.end.getTime() - requestClone.start.getTime())
        rpc.responses++

        cache[request.method] = requestClone
        await storeCache(rpc.blockchain, cache)
    
        rpc.avgResponse = calculateAvgResponse(rpc)
        rpc.requestServed++
        rpc.down = false
    
        return {
            rpc,
            result: requestClone
        }   
    } catch (e: any) {
        rpc.failedRequest++
        rpc.requestServed++

        if(e && e.message && e.name === 'Error') {
            let error = JSON.parse(e.message)
            if(!(error.message.includes("not supported") || error.message.includes("not available"))) rpc.down = true
        } else {
            rpc.down = true
        }

        return {
            rpc,
            error: e
        }
    }
}

export const batchRequest = async (rpcs: RPC[], req: RPCRequest, cache?: CacheConfig) => {
    const promises = rpcs.map(rpc => {
        return request(rpc, req, cache)
    })

    const responses = await Promise.all(promises)

    return responses.map((res, i) => ({
        rpc: res.rpc,
        response: res.result,
        error: res.error
    }))
}