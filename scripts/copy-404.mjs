import { copyFileSync } from 'node:fs'
import { join } from 'node:path'

const index = join('dist', 'index.html')
const notFound = join('dist', '404.html')

copyFileSync(index, notFound)
console.log('Copied dist/index.html → dist/404.html (SPA fallback)')
