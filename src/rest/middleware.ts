import { $TODO } from "@/types/todo"

type MWResult<T> = T | undefined | Promise<T | undefined>
type RO<T> = Readonly<T>
type Args = readonly any[]
type DropLast<T extends Args> = T extends [any]
  ? []
  : T extends [infer X, ...infer Rest]
  ? [X, ...DropLast<Rest>]
  : never

export type MW3 = {
  <A1 extends Args, R1 extends Args>(
    m1: (...args: RO<A1>) => MWResult<R1>,
    handler: (...args: RO<R1>) => MWResult<unknown>
  ): (...args: RO<DropLast<A1>>) => MWResult<unknown>

  <A1 extends Args, R1 extends Args, R2 extends Args>(
    m1: (...args: RO<A1>) => MWResult<R1>,
    m2: (...args: RO<R1>) => MWResult<R2>,
    handler: (...args: RO<R2>) => MWResult<unknown>
  ): (...args: RO<DropLast<A1>>) => MWResult<unknown>

  <A1 extends Args, R1 extends Args, R2 extends Args, R3 extends Args>(
    m1: (...args: RO<A1>) => MWResult<R1>,
    m2: (...args: RO<R1>) => MWResult<R2>,
    m3: (...args: RO<R2>) => MWResult<R3>,
    handler: (...args: Readonly<R3>) => MWResult<unknown>
  ): (...args: RO<DropLast<A1>>) => MWResult<unknown>
}

const fixme =
  (
    ...fns: ((
      ...args: readonly unknown[]
    ) => unknown[] | Promise<unknown[]> | undefined)[]
  ) =>
  async (...args: readonly unknown[]) => {
    let nextArgs: readonly unknown[] | undefined = [...args, {}] as const
    for (const fn of fns) {
      if (!nextArgs) return

      nextArgs = await fn(...nextArgs)
    }
  }

export const mw3: MW3 = fixme as $TODO
