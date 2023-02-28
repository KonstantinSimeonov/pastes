import { NextApiRequest, NextApiResponse } from "next"

export default function healthHandler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).end()
}
