import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import * as uuid from "uuid"

type CreatePaste = {
  title: string
  content: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreatePaste>
) {
  console.log(req.body)
  try {
  const pc = new PrismaClient()
  const p = await pc.paste.create({
    data: { ...req.body, id: uuid.v4() }
  })
  res.status(200).json(p)
  } catch (e) {
    console.error(e)
    res.status(400).json(e as any)
  }
}
