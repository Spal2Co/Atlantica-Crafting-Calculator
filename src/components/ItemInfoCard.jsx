import { formatExpPerCraft } from '../data/craftXp.js'
import { formatNumber } from '../utils/calculate.js'

export default function ItemInfoCard({ item }) {
  if (!item) return null

  const ingredientEntries = Object.entries(item.ingredients ?? {})

  return (
    <aside className="panel border border-neon/20">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-neon/80 mb-3">
        ข้อมูลไอเทม
      </h3>
      <dl className="grid gap-2 text-sm mb-4">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">ชื่อไอเทม</dt>
          <dd className="font-medium text-zinc-200 text-right">{item.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">เลเวลสกิลที่ต้องการ</dt>
          <dd className="text-gold font-semibold">Lv. {item.requiredSkillLv}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">EXP / ครั้ง</dt>
          <dd className="text-neon font-semibold">+{formatExpPerCraft(item.expPerCraft)}</dd>
        </div>
        {item.batchSize > 1 && (
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">คราฟต่อแบทช์</dt>
            <dd className="text-zinc-300">{item.batchSize} ชิ้น (workload {formatNumber(item.workload)})</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">EXP สะสมถึงเลเวลถัดไป</dt>
          <dd className="text-zinc-300">{formatNumber(item.cumulativeExpToNextLevel)}</dd>
        </div>
      </dl>

      {ingredientEntries.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            วัตถุดิบ (ต่อ 1 ครั้งคราฟ)
          </h4>
          <ul className="max-h-48 overflow-y-auto rounded-lg border border-white/5 bg-[#0f0f16] text-xs divide-y divide-white/5">
            {ingredientEntries.map(([name, qty]) => (
              <li key={name} className="flex justify-between gap-3 px-3 py-2">
                <span className="text-zinc-300">{name}</span>
                <span className="text-gold font-medium shrink-0">×{formatNumber(qty)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
