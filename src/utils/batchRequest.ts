import axios from "axios"
import { RPC, RPCRequest } from "../types";
import { calculateAvgResponse } from "./calculateRpcDetail";

export const request = async (rpc: RPC, request: RPCRequest): Promise<{ rpc: RPC, result?: RPCRequest, error?: any }> => {
    let requestClone: RPCRequest = {
        ...request,
        start: new Date()
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
        
        rpc.responses.push(requestClone)
    
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

export const batchRequest = async (rpcs: RPC[], req: RPCRequest) => {
    const promises = rpcs.map(rpc => {
        return request(rpc, req)
    })

    const responses = await Promise.all(promises)

    return responses.map((res, i) => ({
        rpc: res.rpc,
        response: res.result,
        error: res.error
    }))
}