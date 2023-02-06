import { PrismaClient } from "@prisma/client"

let client: PrismaClient

export const withClient = <T>(fn: (client: PrismaClient) => T) => {
  client = client || new PrismaClient()

  return fn(client)
}
