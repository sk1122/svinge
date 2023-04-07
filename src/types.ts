export enum Blockchain {
    ETHEREUM = 'ethereum',
    POLYGON = 'polygon',
    SOLANA = 'solana'
}

export interface RPC {
    requestServed: number
    requestServing: number
    avgResponse: number
    responses: RPCRequest[]
    notSupportedMethods: string[]
    url: string
    name: string
    down: boolean
    blockchain: Blockchain
    failedRequest: number
    weight: number
}

export const defaultRPC = (rpc: string) => ({
    avgResponse: 0,
    blockchain: Blockchain.ETHEREUM,
    failedRequest: 0,
    name: rpc,
    notSupportedMethods: [],
    url: rpc,
    down: false,
    requestServed: 0,
    requestServing: 0,
    responses: [],
    weight: 0
} as RPC)

export interface RPCRequest {
    method: string
    params: string[] | object[]
    result?: any
    start: Date
    end?: Date
}