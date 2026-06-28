import { formatExpPerCraft } from '../data/craftXp.js'
import { calculateIngredientRequirements, formatNumber } from '../utils/calculate.js'

export default function ItemInfoCard({
  item,
  craftQuantity = '1',
  craftActionsNeeded = 1,
  itemsProduced = 1,
}) {
  if (!item) return null

  const ingredientEntries = calculateIngredientRequirements(item.ingredients, craftActionsNeeded)
  const requestedQuantity = Number(craftQuantity)
  const hasCraftPlan = Number.isInteger(requestedQuantity) && requestedQuantity > 0

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
          <dt className="text-zinc-500">EXP / ครั้งกดคราฟ</dt>
          <dd className="text-neon font-semibold">+{formatNumber(item.expPerBatch ?? 0)}</dd>
        </div>
        {item.batchSize > 1 && (
          <>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">ได้ต่อครั้งกดคราฟ</dt>
              <dd className="text-gold font-semibold">{item.batchSize} ชิ้น</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">EXP / ชิ้น</dt>
              <dd className="text-zinc-300">+{formatExpPerCraft(item.expPerCraft)}</dd>
            </div>
          </>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">EXP สะสมถึงเลเวลถัดไป</dt>
          <dd className="text-zinc-300">{formatNumber(item.cumulativeExpToNextLevel)}</dd>
        </div>
      </dl>

      {ingredientEntries.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            วัตถุดิบ
          </h4>
          {hasCraftPlan && (
            <p className="mb-2 text-xs text-zinc-500 leading-relaxed">
              ต้องการ {formatNumber(requestedQuantity)} ชิ้น · คราฟ {formatNumber(craftActionsNeeded)} รอบ
              {item.batchSize > 1 && ` · ได้จริง ${formatNumber(itemsProduced)} ชิ้น`}
            </p>
          )}
          <ul className="max-h-48 overflow-y-auto rounded-lg border border-white/5 bg-[#0f0f16] text-xs divide-y divide-white/5">
            {ingredientEntries.map(({ name, qtyPerCraft, totalQty }) => (
              <li key={name} className="flex justify-between gap-3 px-3 py-2">
                <span className="text-zinc-300">{name}</span>
                <span className="text-right shrink-0">
                  <span className="block text-zinc-500">ต่อรอบ ×{formatNumber(qtyPerCraft)}</span>
                  <span className="block text-gold font-medium">รวม ×{formatNumber(totalQty)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
