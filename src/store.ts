import { existsSync } from "fs"
import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import { Blockchain, RPC } from "./types"

export const setupStore = async () => {
    const rootPath = path.join("~", ".svinge")
    
    await mkdir(rootPath)

    const svingeFilePath = path.join(rootPath, "config.json")

    const initialConfig = {
        name: "svinge",
        version: "0.1.1"
    }

    await writeFile(svingeFilePath, JSON.stringify(initialConfig))
}

export const store = async (chain: Blockchain, config: RPC[]) => {
    const rootPath = path.join("~", ".svinge")
    
    if(!existsSync(rootPath)) {
        await setupStore()
    }

    const chainPath = path.join(rootPath, `${chain}.json`)
    await writeFile(chainPath, JSON.stringify(config))
}

export const readStore = async (chain: Blockchain) => {
    const rootPath = path.join("~", ".svinge", `${chain}.json`)

    if(!existsSync(rootPath)) {
        throw new Error("Data doesn't exist")
    }

    const data = await readFile(rootPath)

    return JSON.parse(data.toString()) as RPC[]
}