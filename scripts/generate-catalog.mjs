/**
 * Optional: pre-build catalog JSON for offline use (requires Node 18+).
 * Usage: node scripts/generate-catalog.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Dynamic import of app modules (run from project root after npm install is NOT required)
const yamlPath =
  process.argv[2] ||
  join(root, 'scripts', 'cache', 'items.yml')

const { parseItemsYaml } = await import('../src/data/parseItemsYaml.js')
const { transformItemsMap } = await import('../src/data/loadCraftCatalog.js')

const text = readFileSync(yamlPath, 'utf8')
const catalog = transformItemsMap(parseItemsYaml(text))

const outDir = join(root, 'public')
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, 'craft-catalog.json')
writeFileSync(outPath, JSON.stringify(catalog))

console.log(`Wrote ${catalog.craftableCount} items to ${outPath}`)
