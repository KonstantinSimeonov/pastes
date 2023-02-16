import type { File, Paste } from "@prisma/client"
import { z } from "zod"

export const file = z.object({
  name: z.string().min(1),
  content: z.string().min(1).max(8192),
})

export const post = z.object({
  description: z.string().nullish(),
  files: file
    .array()
    .min(1)
    .superRefine((files, ctx) => {
      const { errors } = files.reduce(
        ({ names, errors }, { name }, index) =>
          name in names
            ? {
                names,
                errors: [
                  ...errors,
                  {
                    path: [index, `name`],
                    message: `Duplicate file name ${name}`,
                    code: z.ZodIssueCode.custom,
                  },
                ],
              }
            : {
                names: { ...names, [name]: true },
                errors,
              },
        { names: {}, errors: [] as z.ZodIssue[] }
      )

      errors.forEach(e => ctx.addIssue(e))
      if (errors.length) {
        return z.NEVER
      }
    }),
  public: z.boolean().optional().default(true),
})

export type PostResp = Paste

export const get = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(5).max(50).optional().default(10),
  sort: z.enum([`createdAt`, `title`]).optional().default(`createdAt`),
  authorId: z.string().optional(),
})

export type GetResp = (Paste & {
  author: { name: string | null } | null
  files: File[]
})[]
