// We need to normalize the data to be able to sort it

export type Normalized = { display: string; sortVal: number | string | null }

const parseMaybeNumber = (v: string) => {
  const s = v.replace(/[, \u00A0]/g, '')
  if (s === '' || isNaN(Number(s))) return null
  return Number(s)
}

const parseMaybePercent = (v: string) => {
  const m = v.trim().match(/^([-+]?\d+(?:[.,]\d+)?)\s*%$/i)
  if (!m) return null
  const n = parseMaybeNumber(m[1].replace(',', '.'))
  return n == null ? null : n
}

const parseMaybeDate = (v: string) => {
  const t = Date.parse(v)
  return Number.isNaN(t) ? null : t // timestamp
}

const looksPercentHeader = (h: string) => /%|percent|percentage/i.test(h)
const looksDateHeader = (h: string) => /date|maturity|settle|as of/i.test(h)

export function normalizeCell(header: string, value: unknown): Normalized {
  if (value == null) return { display: '', sortVal: null }

  const raw = String(value).trim()
  if (raw === '') return { display: '', sortVal: null }

  // 1) explicit percent
  if (raw.endsWith('%') || looksPercentHeader(header)) {
    const p = parseMaybePercent(raw) ?? parseMaybeNumber(raw)
    return { display: raw, sortVal: p ?? raw.toLowerCase() }
  }

  // 2) numbers
  const num = parseMaybeNumber(raw)
  if (num != null) return { display: raw, sortVal: num }

  // 3) dates
  if (looksDateHeader(header)) {
    const ts = parseMaybeDate(raw)
    if (ts != null) return { display: raw, sortVal: ts }
  } else {
    const ts = parseMaybeDate(raw)
    if (ts != null) return { display: raw, sortVal: ts }
  }

  // 4) fallback: case-insensitive string sorting
  return { display: raw, sortVal: raw.toLowerCase() }
}
