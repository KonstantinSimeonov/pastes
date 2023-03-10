import { z } from "zod"
import { GetServerSidePropsContext } from "next"
import { getToken } from "next-auth/jwt"

export const zquery =
  <S extends z.ZodSchema>(schema: S) =>
  <T extends object>(context: GetServerSidePropsContext, args: T) => {
    const result = schema.safeParse(context.query)
    if (!result.success) {
      // TODO: play nicely with next
      context.res.statusCode = 400
      context.res.end()
      return
    }

    return [context, { ...args, query: result.data as z.infer<S> }] as const
  }

export const withToken = async <T extends object>(
  context: GetServerSidePropsContext,
  args: T
) => [context, { ...args, token: await getToken(context) }] as const
