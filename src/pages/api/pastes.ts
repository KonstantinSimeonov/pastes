import type { Paste } from "@prisma/client"
import { z } from "zod"

export const post = z.object({
  title: z.string().nullish(),
  content: z.string().min(1).max(8192),
  language: z.string().max(20).optional(),
})

export type PostResp = Paste

export const get = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(5).max(50).optional().default(10),
  sort: z.enum([`createdAt`, `title`]).optional().default(`createdAt`),
  authorId: z.string().optional(),
})

export type GetResp = (Paste & { author: { name: string | null } | null })[]
