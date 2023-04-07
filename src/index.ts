import { Ethereum, Solana } from "./loadBalancer";

export abstract class Svinge {
    balanceEthereum = (rpcs: string[]) => {
        return new Ethereum(rpcs)
    }

    balanceSolana = (rpcs: string[]) => {
        return new Solana(rpcs)
    }
}