import { RPC } from "../types";

export const calculateAvgResponse = (rpc: RPC) => {
    let avgResponse = 0

    for (let i = 0; i < rpc.responses.length; i++) {
        if(!(rpc.responses[i].end)) continue

        let localAvgResponse = Number(rpc.responses[i].end?.getTime()) - rpc.responses[i].start.getTime()

        avgResponse += localAvgResponse
    }

    return avgResponse / rpc.responses.length
}