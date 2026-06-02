/** Same formula as jana4u/atlantica_online_craft_calculator CraftExperience.from_workload */
export function expFromWorkload(workload, batchSize = 1, multiplier = 1) {
  const batchXp = Math.floor((Math.abs(Number(workload)) * multiplier) / 50)
  return batchXp / (batchSize || 1)
}

export function formatExpPerCraft(exp) {
  if (!Number.isFinite(exp)) return '0'
  return Number.isInteger(exp) ? String(exp) : exp.toFixed(1)
}
