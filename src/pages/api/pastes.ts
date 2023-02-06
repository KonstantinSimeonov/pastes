import type { NextApiRequest, NextApiResponse } from "next";
import * as uuid from "uuid";
import { restHandler } from "@/rest/http-methods";
import {withClient} from "@/prisma/with-client";

type CreatePaste = {
  title: string | null;
  content: string;
};

async function POST(req: NextApiRequest, res: NextApiResponse<CreatePaste>) {
  const paste = await withClient(client => client.paste.create({
    data: { ...req.body, id: uuid.v4() }
  }))

  return res.status(201).json(paste);
}

export default restHandler({ POST });
