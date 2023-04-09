export enum Blockchain {
    ETHEREUM = 'ethereum',
    POLYGON = 'polygon',
    SOLANA = 'solana'
}

export interface RPC {
    requestServed: number
    requestServing: number
    avgResponse: number
    totalResponse: number
    responses: number
    notSupportedMethods: string[]
    url: string
    name: string
    down: boolean
    blockchain: Blockchain
    failedRequest: number
    weight: number
}

export interface CacheConfig {
    interval: number
    notSupportedMethods: string[]
}

export const defaultConfig = () => ({
    interval: 0,
    notSupportedMethods: []
} as CacheConfig)

export const defaultRPC = (rpc: string, chain: Blockchain) => ({
    avgResponse: 0,
    totalResponse: 0,
    blockchain: chain,
    failedRequest: 0,
    name: rpc,
    notSupportedMethods: [],
    url: rpc,
    down: false,
    requestServed: 0,
    requestServing: 0,
    responses: 0,
    weight: 0
} as RPC)

export interface RPCRequest {
    method: string
    params: string[] | object[]
    result?: any
    start: Date
    end?: Date
}

export type Cache = { [key: string]: RPCRequest }