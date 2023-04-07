import express, { json } from 'express'
import { Svinge } from '.'

const PORT = process.env.PORT ?? 9090

const app = express()

app.use(json())

let ethereumUrls = ["https://mainnet.eth.cloud.ava.do", "https://rpc.ankr.com/eth", "https://eth-mainnet.g.alchemy.com/v2/y141okG6TC3PecBM1mL0BfST9f4WQmLx", "https://ethereum-mainnet-rpc.allthatnode.com", "https://cloudflare-eth.com", "https://rpc.flashbots.net", "https://eth-rpc.gateway.pokt.network"]
let svingePromise = Svinge.balanceEthereum(ethereumUrls)

let solanaUrls = ["https://try-rpc.mainnet.solana.blockdaemon.tech", "https://api.mainnet-beta.solana.com", "https://rpc.ankr.com/solana/0dcdd1ce290c08b16d5efa2b14e7e8f6d4479b2bf7ac06f6fbeffb1abf3bf15c", "https://rpc.helius.xyz/?api-key=cf0d04d7-c2ae-4cd3-b039-2eb5258e1539"]
let svingeSolana = Svinge.balanceSolana(solanaUrls)

app.post("/eth", async (req, res) => {
    try {
        let svinge = await svingePromise
    
        const response = await svinge.request({
            method: req.body.method,
            params:req.body.params,
            start: new Date()
        })
    
        res.status(200).send(response.result)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.post("/sol", async (req, res) => {
    let svinge = await svingeSolana

    const response = await svinge.request({
        method: req.body.method,
        params:req.body.params,
        start: new Date()
    })

    res.status(200).send(response.result)
})

app.listen(PORT, () => {
    console.log(`Svinge listening on http://localhost:${PORT}`)
})