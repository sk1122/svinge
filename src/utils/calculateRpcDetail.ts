import { RPC } from "../types";

export const calculateAvgResponse = (rpc: RPC) => {
    let avgResponse = rpc.totalResponse / rpc.responses

    return avgResponse
}