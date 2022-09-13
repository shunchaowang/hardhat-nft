import pinataSDK from "@pinata/sdk"
import fs from "fs"
import path from "path"

const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

export async function storeImages(imagesFilePath: string) {
    const fullImagePath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagePath)
    console.log(files)
    let responses = []
    for (const fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(
            `${fullImagePath}/${files[fileIndex]}`
        )
        try {
            const respose = await pinata.pinFileToIPFS(readableStreamForFile)
            responses.push(respose)
        } catch (error) {
            console.log(error)
        }
    }

    return { responses, files }
}
