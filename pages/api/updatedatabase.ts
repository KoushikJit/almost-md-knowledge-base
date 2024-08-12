import { updateVectorDB } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { indexname, namespace } = JSON.parse(req.body)
        await handleUpload(indexname, namespace, res);
    }
}

async function handleUpload(indexname: string, namespace: string, res: NextApiResponse) {
    const loader = new DirectoryLoader('./documents',{
        '.pdf': (path: string) => new PDFLoader(path, {
            splitPages: false
        }),
        '.txt': (path: string) => new TextLoader(path)
    });
    const docs = await loader.load();
    const client = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!
    })
    await updateVectorDB(client, indexname, namespace, docs, (filename, totalChunks, chunksUpserted, isComplete) => {
        console.log(`${filename}-${totalChunks}-${chunksUpserted}-${isComplete}`)
        if (!isComplete) {
            res.write(
                JSON.stringify({
                    filename,
                    totalChunks,
                    chunksUpserted,
                    isComplete
                })
            )
        }else{
            res.end();
        }
    })
}
