import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import Prism from "prismjs";
import React from "react";
import "node_modules/prismjs/themes/prism-tomorrow.css";

type Props = {
  id: string;
  title: string | null;
  content: string;
  language: string | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const pc = new PrismaClient();
  const { id, title, content, language, ...rest } = (await pc.paste.findFirst({
    where: {
      id: String(ctx.query.id),
    },
  }))!;

  return {
    props: { id, title, content, language },
  };
};

export default function PasteById(props: Props) {
  React.useEffect(() => {
    if (typeof window !== "undefined") Prism.highlightAll();
  }, []);

  const area = React.useRef<HTMLTextAreaElement>(null);

  const copy = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const ta = area.current;
    if (!ta) return;
    ta.focus();
    ta.selectionStart = 0;
    ta.selectionEnd = props.content.length;

    document.execCommand(`copy`);

    e.currentTarget.focus();
  }, []);

  return (
    <div>
      <h1>{props.title}</h1>
      <button onClick={copy}>Copy to clipboard</button>
      <textarea readOnly className="invis" ref={area} value={props.content} />
      <pre>
        <code className={`language-${props.language}`}>{props.content}</code>
      </pre>
    </div>
  );
}
