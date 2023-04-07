import express, { json } from 'express'
import { Svinge } from '.'

const PORT = process.env.PORT ?? 9090

const app = express()

app.use(json())

let urls = ["https://mainnet.eth.cloud.ava.do", "https://rpc.ankr.com/eth", "https://eth-mainnet.g.alchemy.com/v2/y141okG6TC3PecBM1mL0BfST9f4WQmLx", "https://ethereum-mainnet-rpc.allthatnode.com", "https://cloudflare-eth.com", "https://rpc.flashbots.net", "https://eth-rpc.gateway.pokt.network"]

let svingePromise = Svinge.balanceEthereum(urls)

app.post("/eth", async (req, res) => {
    let svinge = await svingePromise

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