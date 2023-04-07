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
    url: string
    name: string
    blockchain: Blockchain
    failedRequest: number
    weight: number
}

export interface RPCRequest {
    method: string
    params?: string[] | object[]
    result: any
    start: Date
    end: Date
}