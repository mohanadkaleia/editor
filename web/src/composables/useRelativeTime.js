/**
 * useRelativeTime — tiny Arabic relative-time formatter.
 *
 * The backend returns `updated_at` as epoch seconds. We render a short
 * "تم التعديل ..." string for the top nav. Deliberately minimal; we
 * only need the granularities that appear in daily use.
 */

/**
 * Format an epoch-seconds timestamp as a short Arabic relative phrase.
 * Returns an empty string when the input is not a finite number.
 *
 * Examples:
 *   now       -> "تم التعديل الآن"
 *   45s ago   -> "تم التعديل منذ ثوانٍ"
 *   3m ago    -> "تم التعديل منذ 3 دقائق"
 *   1h ago    -> "تم التعديل منذ ساعة"
 *   2d ago    -> "تم التعديل منذ يومين"
 *   14d ago   -> "تم التعديل منذ أسبوعين"
 */
export function formatRelativeArabic(timestamp) {
  if (timestamp === null || timestamp === undefined) return ''
  const ms = typeof timestamp === 'number' ? timestamp * 1000 : Date.parse(timestamp)
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) return ''

  const now = Date.now()
  const seconds = Math.max(0, Math.round((now - date.getTime()) / 1000))

  if (seconds < 10) return 'تم التعديل الآن'
  if (seconds < 60) return 'تم التعديل منذ ثوانٍ'

  const minutes = Math.round(seconds / 60)
  if (minutes === 1) return 'تم التعديل منذ دقيقة'
  if (minutes === 2) return 'تم التعديل منذ دقيقتين'
  if (minutes < 60) return `تم التعديل منذ ${minutes} دقائق`

  const hours = Math.round(minutes / 60)
  if (hours === 1) return 'تم التعديل منذ ساعة'
  if (hours === 2) return 'تم التعديل منذ ساعتين'
  if (hours < 24) return `تم التعديل منذ ${hours} ساعات`

  const days = Math.round(hours / 24)
  if (days === 1) return 'تم التعديل منذ يوم'
  if (days === 2) return 'تم التعديل منذ يومين'
  if (days < 7) return `تم التعديل منذ ${days} أيام`

  const weeks = Math.round(days / 7)
  if (weeks === 1) return 'تم التعديل منذ أسبوع'
  if (weeks === 2) return 'تم التعديل منذ أسبوعين'
  if (weeks < 5) return `تم التعديل منذ ${weeks} أسابيع`

  const months = Math.round(days / 30)
  if (months <= 1) return 'تم التعديل منذ شهر'
  if (months === 2) return 'تم التعديل منذ شهرين'
  if (months < 12) return `تم التعديل منذ ${months} أشهر`

  const years = Math.round(days / 365)
  if (years <= 1) return 'تم التعديل منذ سنة'
  if (years === 2) return 'تم التعديل منذ سنتين'
  return `تم التعديل منذ ${years} سنوات`
}
