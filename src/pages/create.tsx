import Head from "next/head";
import {useRouter} from "next/router";
import * as React from "react";

export default function Create() {
  const [title, setTitle] = React.useState(``)
  const [content, setContent] = React.useState(``)
  const r = useRouter()

  return (
    <>
      <Head>
        <title>New Paste</title>
      </Head>
      <main>
        <form>
          <fieldset>
            <label>Title
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </label>
          </fieldset>
          <fieldset>
            <label>Title
              <textarea value={content} onChange={e => setContent(e.target.value)} />
            </label>
          </fieldset>
          <button onClick={e => {
            e.preventDefault()
            fetch(`/api/pastes`, { 
              method: `POST`, 
              body: JSON.stringify({ title, content }) ,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
            })
              .then(r => r.status < 300 ? r.json() : Promise.reject(r.json()))
              .then(p => r.push(`/pastes/${p.id}`))
              .catch(err => alert(JSON.stringify(err)))
          }}>
            Create
          </button>
        </form>
      </main>
    </>
  )
}
