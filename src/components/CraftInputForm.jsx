import { useMemo, useState } from 'react'
import { formatNumber } from '../utils/calculate.js'

const MAX_DROPDOWN_ITEMS = 300

export default function CraftInputForm({
  categories,
  categoryId,
  itemId,
  itemSearch,
  currentLevel,
  currentExp,
  targetLevel,
  craftQuantity,
  onCategoryChange,
  onItemChange,
  onItemSearchChange,
  onCurrentLevelChange,
  onCurrentExpChange,
  onTargetLevelChange,
  onCraftQuantityChange,
}) {
  const [localSearch, setLocalSearch] = useState(itemSearch ?? '')

  const category = categories.find((c) => c.id === categoryId) ?? categories[0]
  const allItems = category?.items ?? []

  const searchTerm = (itemSearch ?? localSearch).trim().toLowerCase()

  const filteredItems = useMemo(() => {
    if (!searchTerm) return allItems
    return allItems.filter((it) => it.name.toLowerCase().includes(searchTerm))
  }, [allItems, searchTerm])

  const dropdownItems = useMemo(() => {
    const list = filteredItems.length > 0 ? filteredItems : allItems
    const sliced = list.slice(0, MAX_DROPDOWN_ITEMS)
    const selected = allItems.find((i) => i.id === itemId)
    if (selected && !sliced.some((i) => i.id === itemId)) {
      return [selected, ...sliced.filter((i) => i.id !== itemId)].slice(0, MAX_DROPDOWN_ITEMS + 1)
    }
    return sliced
  }, [filteredItems, allItems, itemId])

  const selectValue = dropdownItems.some((i) => i.id === itemId)
    ? itemId
    : (dropdownItems[0]?.id ?? '')

  if (!categories?.length) {
    return (
      <section className="panel">
        <p className="text-sm text-zinc-500">ไม่พบข้อมูลไอเทมคราฟ — ลองกดโหลดข้อมูลใหม่</p>
      </section>
    )
  }

  return (
    <section className="panel space-y-5">
      <header>
        <h2 className="panel-title">ตั้งค่าการคราฟ</h2>
        <p className="panel-subtitle">
          ข้อมูลไอเทมจาก{' '}
          <a
            href="https://craftcalculator.jana4u.net/"
            target="_blank"
            rel="noreferrer"
            className="text-neon/80 hover:text-neon"
          >
            craftcalculator.jana4u.net
          </a>
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field sm:col-span-2">
          <span className="field-label">สายสกิล (Skill)</span>
          <select
            className="input"
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
                {cat.labelTh !== cat.label ? ` — ${cat.labelTh}` : ''} ({cat.items?.length ?? 0} ไอเทม)
              </option>
            ))}
          </select>
        </label>

        <label className="field sm:col-span-2">
          <span className="field-label">ค้นหาไอเทม</span>
          <input
            type="search"
            className="input"
            value={itemSearch ?? localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value)
              onItemSearchChange?.(e.target.value)
            }}
            placeholder="พิมพ์ชื่อไอเทม เช่น Healing Potion, Adamantium..."
          />
          <p className="text-xs text-zinc-500 mt-1">
            {searchTerm
              ? `พบ ${filteredItems.length} จาก ${allItems.length} ไอเทมในสายนี้`
              : `${allItems.length} ไอเทมคราฟได้ในสาย ${category?.label}`}
            {filteredItems.length > MAX_DROPDOWN_ITEMS &&
              ` · แสดงในรายการ ${MAX_DROPDOWN_ITEMS} รายการแรก — ค้นหาให้แคบลง`}
          </p>
        </label>

        <label className="field sm:col-span-2">
          <span className="field-label">ไอเทม (Item)</span>
          <select
            className="input"
            value={selectValue}
            onChange={(e) => onItemChange(e.target.value)}
          >
            {dropdownItems.map((it) => (
              <option key={it.id} value={it.id}>
                {it.name} (Lv.{it.requiredSkillLv} · +{formatNumber(it.expPerBatch ?? 0)} EXP/ครั้ง
                {it.batchSize > 1 ? ` · ${it.batchSize} ชิ้น` : ''})
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">เลเวลสกิลปัจจุบัน</span>
          <input
            type="number"
            min={1}
            max={180}
            className="input"
            value={currentLevel}
            onChange={(e) => onCurrentLevelChange(e.target.value)}
            placeholder="เช่น 25"
          />
        </label>

        <label className="field">
          <span className="field-label">EXP คราฟปัจจุบัน (ในเลเวลนี้)</span>
          <input
            type="number"
            min={0}
            className="input"
            value={currentExp}
            onChange={(e) => onCurrentExpChange(e.target.value)}
            placeholder="เช่น 1200"
          />
        </label>

        <label className="field sm:col-span-2">
          <span className="field-label">เป้าหมายเลเวลสกิล (ปลดล็อกไอเทมถัดไป)</span>
          <input
            type="number"
            min={1}
            max={180}
            className="input"
            value={targetLevel}
            onChange={(e) => onTargetLevelChange(e.target.value)}
            placeholder="เช่น 30"
          />
        </label>

        <label className="field sm:col-span-2">
          <span className="field-label">จำนวนไอเทมที่ต้องการคราฟ</span>
          <input
            type="number"
            min={1}
            className="input"
            value={craftQuantity}
            onChange={(e) => onCraftQuantityChange(e.target.value)}
            placeholder="เช่น 500"
          />
        </label>
      </div>
    </section>
  )
}
