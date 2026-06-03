/** EXP ต่อ 1 ครั้งกดคราฟ (ทั้ง batch) — CraftExperience.from_workload */
export function expPerBatchFromWorkload(workload, multiplier = 1) {
  return Math.floor((Math.abs(Number(workload)) * multiplier) / 50)
}

/** EXP ต่อ 1 ชิ้นที่ได้ — craft_xp_gained_per_item */
export function expPerItemFromWorkload(workload, batchSize = 1, multiplier = 1) {
  const batchXp = expPerBatchFromWorkload(workload, multiplier)
  return batchXp / (batchSize || 1)
}

/** @deprecated use expPerItemFromWorkload */
export function expFromWorkload(workload, batchSize = 1, multiplier = 1) {
  return expPerItemFromWorkload(workload, batchSize, multiplier)
}

export function formatExpPerCraft(exp) {
  if (!Number.isFinite(exp)) return '0'
  return Number.isInteger(exp) ? String(exp) : exp.toFixed(1)
}
