import components from "prismjs/components.json"
import Prism from "prismjs"
import * as fs from "fs"
import * as path from "path"

type LangName = keyof typeof components.languages

type Langs = Record<
  LangName,
  {
    require?: LangName | readonly LangName[]
  }
>

const get_deps = (lang: LangName, langs: Langs): LangName[] => {
  const { require } = langs[lang]
  if (Prism.languages[lang]) return []
  if (!require) return [lang]
  const deps = Array.isArray(require) ? require : [require]
  return [lang, ...deps.flatMap(d => get_deps(d, langs))]
}

const build_graph = (langs: Langs) => {
  const ls = Object.keys(langs) as readonly LangName[]
  return ls
    .filter(x => x !== `meta` && !Prism.languages[x])
    .map((k: LangName) => [k, get_deps(k, langs).reverse()])
    .sort(([, a], [, b]) => b.length - a.length)
}

//const graph = build_graph(components.languages as Langs)

const graph_to_imports = (graph: ReturnType<typeof build_graph>) =>
  graph.map(
    ([k, deps]) =>
      [
        k,
        Array.from(
          new Set(deps),
          dep => `import "prismjs/components/prism-${dep}"`
        ).join(`\n`),
      ] as const
  )

const write_modules = (imports: ReturnType<typeof graph_to_imports>) => {
  console.log(imports)
  for (const [filename, content] of imports) {
    const filepath = path.join(
      process.cwd(),
      `src`,
      `prism-components`,
      `${filename}.ts`
    )
    console.log(`Writing to ${filepath}\n`, content, `\n`)
    fs.writeFileSync(filepath, content, { encoding: `utf8` })
  }
}

write_modules(graph_to_imports(build_graph(components.languages as Langs)))
