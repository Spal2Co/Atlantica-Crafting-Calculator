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
  return (
    <section className="panel flex flex-col gap-6">
      <header>
        <h2 className="panel-title">ผลการคำนวณ</h2>
        <p className="panel-subtitle">จำนวนครั้งที่ต้องคราฟเพื่อถึงเป้าหมาย</p>
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
            <p className="result-hero-label">ต้องคราฟทั้งหมด</p>
            <p className="result-hero-value">{formatNumber(result.craftsNeeded)}</p>
            <p className="result-hero-unit">ชิ้น / ครั้ง</p>
          </div>

          <ul className="summary-list">
            <li>
              <span>ไอเทมที่เลือก</span>
              <strong>{selectedItem?.name}</strong>
            </li>
            <li>
              <span>EXP ต่อครั้ง</span>
              <strong>+{formatExpPerCraft(selectedItem?.expPerCraft ?? 0)}</strong>
            </li>
            <li>
              <span>คุณขาด EXP อีก</span>
              <strong className="text-gold">{formatNumber(result.expNeeded)} แต้ม</strong>
            </li>
            <li>
              <span>ต้องกดคราฟทั้งหมด</span>
              <strong className="text-neon">{formatNumber(result.craftsNeeded)} รอบ</strong>
            </li>
            <li>
              <span>EXP สะสมปัจจุบัน → เป้าหมาย</span>
              <strong>
                {formatNumber(result.currentTotal)} → {formatNumber(result.targetTotal)}
              </strong>
            </li>
          </ul>
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
