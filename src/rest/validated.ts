import type { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import { z, ZodError } from "zod";

export const validatedQuery = <S extends z.ZodSchema>(schema: S) => <T>(
  handler: (
    req: NextApiRequest & { validQuery: z.infer<S> },
    res: NextApiResponse<T>
  ) => unknown | Promise<unknown>
): NextApiHandler<T | ZodError> => (req, res) => {
  const result = schema.safeParse(req.query);
  if (result.success) {
    const _req = Object.assign(req, { validQuery: result.data });
    return handler(_req, res);
  }

  return res.status(400).json(result.error);
};
