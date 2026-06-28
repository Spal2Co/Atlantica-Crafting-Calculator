import { formatExpPerCraft } from '../data/craftXp.js'
import { formatNumber } from '../utils/calculate.js'

export default function CraftResultPanel({
  result,
  error,
  selectedItem,
  onReset,
  onSave,
  onRefreshData,
  saveMessage,
  catalogInfo,
}) {
  const batchSize = selectedItem?.batchSize ?? 1

  return (
    <section className="panel flex flex-col gap-6">
      <header>
        <h2 className="panel-title">ผลการคำนวณ</h2>
        <p className="panel-subtitle">
          นับตาม EXP สกิล — 1 ครั้งกดคราฟ = 1 รอบในเกม
          {batchSize > 1 ? ` (ได้ ${batchSize} ชิ้นต่อครั้ง)` : ''}
        </p>
      </header>

      {catalogInfo && (
        <p className="text-xs text-zinc-500 -mt-2">
          โหลดแล้ว {formatNumber(catalogInfo.craftableCount)} ไอเทมคราฟได้ ·{' '}
          {catalogInfo.skills?.length} สายสกิล
        </p>
      )}

      {error && (
        <div className="alert-error" role="alert">
          <span className="text-lg" aria-hidden>
            ⚠
          </span>
          <p>{error}</p>
        </div>
      )}

      {result?.ok && (
        <>
          <div className="result-hero">
            <p className="result-hero-label">ต้องคราฟจำนวน</p>
            <p className="result-hero-value">{formatNumber(result.itemsProduced)}</p>
            <p className="result-hero-unit">ชิ้น</p>
          </div>

          <ul className="summary-list">
            <li>
              <span>ไอเทมที่เลือก</span>
              <strong>{selectedItem?.name}</strong>
            </li>
            <li>
              <span>EXP ต่อครั้งกดคราฟ</span>
              <strong className="text-neon">+{formatNumber(result.expPerBatch)}</strong>
            </li>
            {batchSize > 1 && (
              <li>
                <span>EXP ต่อชิ้น</span>
                <strong>+{formatExpPerCraft(result.expPerItem)}</strong>
              </li>
            )}
            <li>
              <span>คุณขาด EXP อีก</span>
              <strong className="text-gold">{formatNumber(result.expNeeded)} แต้ม</strong>
            </li>
            <li>
              <span>EXP ที่ได้หลังคราฟครบ</span>
              <strong>+{formatNumber(result.expGainedTotal)}</strong>
              <span className="text-xs text-zinc-500 sm:ml-1">(อาจมากกว่าที่ขาดเล็กน้อย)</span>
            </li>
            <li>
              <span>EXP สะสมปัจจุบัน → เป้าหมาย</span>
              <strong>
                {formatNumber(result.currentTotal)} → {formatNumber(result.targetTotal)}
              </strong>
            </li>
          </ul>

          <p className="text-xs text-zinc-500 leading-relaxed border-t border-white/5 pt-3">
            <strong className="text-zinc-400">ครั้ง</strong> = กดปุ่มคราฟในเกม 1 รอบ (1 batch)
            · <strong className="text-zinc-400">ชิ้น</strong> = จำนวนไอเทมที่ออกมา (บางไอเทม 1 ครั้งได้หลายชิ้น)
            · เลเวลสกิลขั้นต่ำเพื่อปลดล็อกไอเทม (เช่น Lv.63) ไม่ใช่จำนวนครั้งคราฟ — ดูที่ &quot;เลเวลสกิลที่ต้องการ&quot;
          </p>
        </>
      )}

      {!result?.ok && !error && (
        <p className="text-center text-sm text-zinc-500 py-8">
          กรอกข้อมูลด้านซ้ายเพื่อดูผลคำนวณอัตโนมัติ
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          รีเซ็ตค่าทั้งหมด
        </button>
        <button type="button" className="btn btn-primary" onClick={onSave} disabled={!result?.ok}>
          บันทึกประวัติล่าสุด
        </button>
        {onRefreshData && (
          <button type="button" className="btn btn-secondary" onClick={onRefreshData}>
            โหลดข้อมูลใหม่
          </button>
        )}
      </div>

      {saveMessage && <p className="text-sm text-emerald-400/90">{saveMessage}</p>}
    </section>
  )
}
