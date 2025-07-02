import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

// fetch twitter profile data for ids in data/twitter-ids.json and write to data/design-engineers.json
const bearer = process.env.TWITTER_BEARER_TOKEN
if (!bearer) {
  console.error('missing TWITTER_BEARER_TOKEN env')
  process.exit(1)
}

type TwitterUser = {
  id: string
  username: string
  name: string
  description: string
  profile_image_url: string
}

const readJson = async <T>(p: string): Promise<T> =>
  JSON.parse(await fs.readFile(p, 'utf8'))

const writeJson = async (p: string, data: unknown) =>
  fs.writeFile(p, JSON.stringify(data, null, 2) + '\n')

const IDS_PATH = path.join(__dirname, '..', 'data', 'twitter-ids.json')
const OUT_PATH = path.join(__dirname, '..', 'data', 'design-engineers.json')

const chunk = <T>(arr: T[], size: number): T[][] => {
  const res: T[][] = []
  for (let i = 0; i < arr.length; i += size) { res.push(arr.slice(i, i + size)) }
  return res
}

// simple helper to pause execution
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// wrapper that retries when twitter returns 429 rate limit
const fetchWithRetry = async (url: string, init: RequestInit, attempt = 0): Promise<Response> => {
  const res = await fetch(url, init)
  if (res.status !== 429) { return res }

  const reset = Number(res.headers.get('x-rate-limit-reset') ?? '0') * 1000
  const wait = Math.max(reset - Date.now(), 60_000) // default wait 60s
  console.warn(`rate-limited (attempt ${attempt + 1}), retrying in ${Math.round(wait / 1000)}s…`)
  await sleep(wait)
  return fetchWithRetry(url, init, attempt + 1)
}

const main = async () => {
  const ids: (string | number)[] = await readJson(IDS_PATH)
  const chunks = chunk(ids.map(String), 100)

  const all: TwitterUser[] = []

  for (const part of chunks) {
    const url = new URL('https://api.twitter.com/2/users/by')
    url.searchParams.set('usernames', part.join(','))
    url.searchParams.set('user.fields', 'name,username,description,profile_image_url')

    const res = await fetchWithRetry(url.toString(), {
      headers: { Authorization: `Bearer ${bearer}` },
    })

    if (!res.ok) {
      console.error('failed fetching', await res.text())
      process.exit(1)
    }

    const json = (await res.json()) as { data: TwitterUser[] }
    if (json.data) all.push(...json.data)
  }

  const simplified = all.map((u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    description: u.description,
    image: u.profile_image_url.replace('_normal', ''),
  }))

  await writeJson(OUT_PATH, simplified)
  console.log(`wrote ${simplified.length} users to ${OUT_PATH}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
