import {PrismaClient} from "@prisma/client";
import {GetServerSideProps} from "next";

type Props = { id: string; title: string; content: string }

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const pc = new PrismaClient()
  const { id, title, content, ...rest } = (await pc.paste.findFirst({
    where: {
      id: String(ctx.query.id)
    }
  }))!

  return {
    props: { id, title, content }
  }
}

export default function PasteById(props: Props) {
  return (
    <div>
      <div>{props.id}</div>
      <div>{props.title}</div>
      <div>{props.content}</div>
    </div>
  )
}
