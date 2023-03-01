# Pastes

### How to run
```bash
npm i # node 16 required
docker compose up -d # start postgres
npm run dev
```

Deployed at [pastes.konsimeonov.lol](https://pastes.konsimeonov.lol/).

### TODOs
- ~move off vercel into aws on express (function cold start times are awful)~
- add ci for prod migrations (don't like this but why not give it a spin)
- add api/db/page tests
    - refactor paste update
- fix api handler HOFs
    - add api handler for auth
    - add getServerSideProps HOFs for auth and validation
- add cache for most recent pastes instead of querying the db
- change paste content type to text
- extract components from some pages
- source light/dark theme from user prefs
- fix user page
- ~fix user stats~
  - refresh materialized view periodically
- put expiry date on pastes with anonymous authors
- ~add file count limit per paste~
- ~add download file button~
- add discover page with pagination and stuff
- think about storing file contents in S3
- add markdown rendering
- experiment with some kind of editor for editing/creating pastes
- add an embed functionality
- ~fix most recent clicks~
