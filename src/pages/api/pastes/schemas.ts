import type { File, Paste } from "@prisma/client"
import { z } from "zod"

export const file = z.object({
  name: z.string().min(1),
  content: z.string().min(1).max(8192),
})

export const MAX_FILES_PER_PASTE = 30

export const paste = <T extends z.Schema<{ name: string; content: string }>>(
  file: T
) =>
  z.object({
    description: z.string().nullish(),
    files: file
      .array()
      .min(1)
      .max(MAX_FILES_PER_PASTE)
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
    public: z.boolean().default(true),
  })

export const post = paste(file)

export const put = paste(
  file.extend({
    id: z.string().optional(),
  })
).extend({
  id: z.string().uuid(),
})

export type PostResp = Paste

export const get = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(5).max(50).optional().default(10),
  sort: z.enum([`createdAt`, `title`]).optional().default(`createdAt`),
  authorId: z.string().optional(),
})

export type GetResp = (Paste & {
  author: { name: string | null; image: string | null } | null
  createdAt: Date | string
  files: File[]
})[]
