import type { NextApiRequest, NextApiResponse } from "next";
import * as uuid from "uuid";
import { restHandler } from "@/rest/http-methods";
import { withClient } from "@/prisma/with-client";
import { validatedQuery } from "@/rest/validated";
import { z } from "zod";

type CreatePaste = {
  title: string | null;
  content: string;
};

async function POST(req: NextApiRequest, res: NextApiResponse<CreatePaste>) {
  const paste = await withClient((client) =>
    client.paste.create({
      data: { ...req.body, id: uuid.v4() },
    })
  );

  return res.status(201).json(paste);
}

const GET = validatedQuery(
  z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(5).max(50).optional().default(10),
    sort: z.enum([`createdAt`, `title`]).optional().default(`createdAt`),
  })
)(async (req, res) => {
  const { sort, page, pageSize } = req.validQuery;
  const pastes = await withClient((client) =>
    client.paste.findMany({
      orderBy: {
        [sort]: `desc`,
      },
      skip: pageSize * (page - 1),
      take: pageSize,
    })
  );

  res.json(pastes);
});

export default restHandler({ POST, GET });
