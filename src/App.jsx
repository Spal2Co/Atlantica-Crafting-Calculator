import { useCallback, useEffect, useMemo, useState } from 'react'
import CraftInputForm from './components/CraftInputForm.jsx'
import CraftResultPanel from './components/CraftResultPanel.jsx'
import ItemInfoCard from './components/ItemInfoCard.jsx'
import {
  findItemById,
  getCategoryById,
  getCraftCatalog,
  loadCraftCatalog,
} from './data/loadCraftCatalog.js'
import {
  calculateCraftNeeded,
  calculateCraftQuantityPlan,
  parseNonNegativeInt,
} from './utils/calculate.js'

const STORAGE_KEY = 'atlantica-craft-calculator-v1'
const THEME_STORAGE_KEY = 'atlantica-craft-theme-v1'

const THEMES = [
  { id: 'night', label: 'Night' },
  { id: 'dawn', label: 'Dawn' },
  { id: 'forest', label: 'Forest' },
]

function emptyForm() {
  return {
    categoryId: '',
    itemId: '',
    itemSearch: '',
    currentLevel: '1',
    currentExp: '0',
    targetLevel: '10',
    craftQuantity: '1',
  }
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function loadSavedTheme() {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    return THEMES.some((theme) => theme.id === raw) ? raw : THEMES[0].id
  } catch {
    return THEMES[0].id
  }
}

function resolveFormWithCatalog(saved, catalog) {
  const first = catalog.categories[0]
  const categoryId =
    catalog.categories.find((c) => c.id === saved?.categoryId)?.id ?? first?.id ?? ''
  const category = getCategoryById(categoryId, catalog)
  const itemId =
    category?.items.find((i) => i.id === saved?.itemId)?.id ?? category?.items[0]?.id ?? ''

  return {
    ...emptyForm(),
    ...saved,
    categoryId,
    itemId,
    itemSearch: saved?.itemSearch ?? '',
  }
}

export default function App() {
  const [catalog, setCatalog] = useState(null)
  const [catalogError, setCatalogError] = useState(null)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [saveMessage, setSaveMessage] = useState('')
  const [theme, setTheme] = useState(loadSavedTheme)

  const fetchCatalog = useCallback(async (forceRefresh = false) => {
    if (forceRefresh || !getCraftCatalog()) {
      setCatalogLoading(true)
    }
    setCatalogError(null)
    try {
      const data = await loadCraftCatalog({ forceRefresh })
      setCatalog(data)
      setForm((prev) => {
        const saved = prev.categoryId ? prev : loadSavedState()
        return resolveFormWithCatalog(saved ?? prev, data)
      })
    } catch (err) {
      setCatalogError(err instanceof Error ? err.message : 'โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setCatalogLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCatalog(false)
  }, [fetchCatalog])

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const category = useMemo(
    () => (catalog ? getCategoryById(form.categoryId, catalog) : null),
    [catalog, form.categoryId],
  )

  const selectedItem = useMemo(
    () => (catalog ? findItemById(form.categoryId, form.itemId, catalog) : null),
    [catalog, form.categoryId, form.itemId],
  )

  useEffect(() => {
    if (!category?.items?.length) return
    const exists = category.items.some((i) => i.id === form.itemId)
    if (!exists) {
      setForm((prev) => ({ ...prev, itemId: category.items[0].id }))
    }
  }, [category, form.itemId])

  const { result, error } = useMemo(() => {
    if (!selectedItem) return { result: null, error: null }

    const levelCheck = parseNonNegativeInt(form.currentLevel, 'เลเวลสกิลปัจจุบัน')
    if (!levelCheck.ok) return { result: null, error: levelCheck.message }

    const expCheck = parseNonNegativeInt(form.currentExp, 'EXP คราฟปัจจุบัน')
    if (!expCheck.ok) return { result: null, error: expCheck.message }

    const targetCheck = parseNonNegativeInt(form.targetLevel, 'เลเวลเป้าหมาย')
    if (!targetCheck.ok) return { result: null, error: targetCheck.message }

    const calc = calculateCraftNeeded({
      currentLevel: levelCheck.value,
      currentExp: expCheck.value,
      targetLevel: targetCheck.value,
      expPerCraft: selectedItem.expPerCraft ?? 0,
      batchSize: selectedItem.batchSize ?? 1,
    })

    if (!calc.ok) return { result: null, error: calc.message }
    return { result: calc, error: null }
  }, [form, selectedItem])

  const craftQuantityPlan = useMemo(
    () => calculateCraftQuantityPlan(form.craftQuantity, selectedItem?.batchSize ?? 1),
    [form.craftQuantity, selectedItem],
  )

  const handleCategoryChange = useCallback(
    (categoryId) => {
      if (!catalog) return
      const cat = getCategoryById(categoryId, catalog)
      setForm((prev) => ({
        ...prev,
        categoryId,
        itemId: cat?.items[0]?.id ?? prev.itemId,
        itemSearch: '',
      }))
      setSaveMessage('')
    },
    [catalog],
  )

  const handleReset = useCallback(() => {
    if (catalog) {
      setForm(resolveFormWithCatalog(null, catalog))
    } else {
      setForm(emptyForm())
    }
    setSaveMessage('')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [catalog])

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
      setSaveMessage('บันทึกแล้ว — เปิดหน้าใหม่จะโหลดค่าล่าสุดอัตโนมัติ')
      setTimeout(() => setSaveMessage(''), 4000)
    } catch {
      setSaveMessage('ไม่สามารถบันทึกได้ (LocalStorage ถูกปิดหรือเต็ม)')
    }
  }, [form])

  return (
    <div className="theme-root min-h-screen bg-mesh" data-theme={theme}>
      <header className="border-b border-white/5 bg-surface/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-neon/70 font-display">
              Atlantica Online
            </p>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-gold glow-gold">
              Craft EXP Calculator
            </h1>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <label className="theme-picker">
              <span>Theme</span>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                {THEMES.map((themeOption) => (
                  <option key={themeOption.id} value={themeOption.id}>
                    {themeOption.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs text-zinc-500 max-w-sm sm:text-right">
              ข้อมูลคราฟจาก{' '}
              <a
                href="https://craftcalculator.jana4u.net/"
                target="_blank"
                rel="noreferrer"
                className="text-neon/80 hover:text-neon underline-offset-2 hover:underline"
              >
                craftcalculator.jana4u.net
              </a>
              {' · '}
              <a
                href="https://craftcalculator.jana4u.net/experience-table"
                target="_blank"
                rel="noreferrer"
                className="text-neon/80 hover:text-neon underline-offset-2 hover:underline"
              >
                ตาราง EXP
              </a>
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        {catalogLoading && (
          <div className="panel mb-6 text-center py-10">
            <p className="text-neon font-display animate-pulse">กำลังโหลดข้อมูลคราฟ...</p>
            <p className="text-sm text-zinc-500 mt-2">ดึงจาก craftcalculator.jana4u.net · ครั้งแรกอาจใช้เวลาสักครู่</p>
          </div>
        )}

        {catalogError && !catalogLoading && (
          <div className="panel mb-6">
            <div className="alert-error" role="alert">
              <span className="text-lg" aria-hidden>
                ⚠
              </span>
              <div>
                <p className="font-semibold">โหลดข้อมูลคราฟไม่ได้</p>
                <p>{catalogError}</p>
              </div>
            </div>
          </div>
        )}

        {catalog && !catalogLoading && (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-6">
              <CraftInputForm
                categories={catalog.categories}
                categoryId={form.categoryId}
                itemId={form.itemId}
                itemSearch={form.itemSearch}
                currentLevel={form.currentLevel}
                currentExp={form.currentExp}
                targetLevel={form.targetLevel}
                craftQuantity={form.craftQuantity}
                onCategoryChange={handleCategoryChange}
                onItemChange={(itemId) => {
                  setForm((p) => ({ ...p, itemId }))
                  setSaveMessage('')
                }}
                onItemSearchChange={(itemSearch) => {
                  setForm((p) => ({ ...p, itemSearch }))
                }}
                onCurrentLevelChange={(v) => {
                  setForm((p) => ({ ...p, currentLevel: v }))
                  setSaveMessage('')
                }}
                onCurrentExpChange={(v) => {
                  setForm((p) => ({ ...p, currentExp: v }))
                  setSaveMessage('')
                }}
                onTargetLevelChange={(v) => {
                  setForm((p) => ({ ...p, targetLevel: v }))
                  setSaveMessage('')
                }}
                onCraftQuantityChange={(v) => {
                  setForm((p) => ({ ...p, craftQuantity: v }))
                  setSaveMessage('')
                }}
              />
              <ItemInfoCard
                item={selectedItem}
                craftQuantity={form.craftQuantity}
                craftActionsNeeded={craftQuantityPlan?.craftActionsNeeded ?? 1}
                itemsProduced={craftQuantityPlan?.itemsProduced ?? selectedItem?.batchSize ?? 1}
              />
            </div>

            <div className="lg:col-span-2">
              <CraftResultPanel
                result={result ? { ok: true, ...result } : null}
                error={error}
                selectedItem={selectedItem}
                onReset={handleReset}
                onSave={handleSave}
                onRefreshData={() => fetchCatalog(true)}
                saveMessage={saveMessage}
                catalogInfo={catalog}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-zinc-600 pb-8 px-4">
        ข้อมูลเกมจากโปรเจกต{' '}
        <a
          href="https://github.com/jana4u/atlantica_online_craft_calculator"
          target="_blank"
          rel="noreferrer"
          className="text-zinc-500 hover:text-neon"
        >
          atlantica_online_craft_calculator
        </a>{' '}
        (MIT) · EXP = floor(workload ÷ 50) ÷ batch_size
      </footer>
    </div>
  )
}
