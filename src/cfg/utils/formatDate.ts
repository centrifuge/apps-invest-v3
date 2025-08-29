type DateFormatVariant = 'iso' | 'short'

const shortMonths: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Formats a date into a predefined format using UTC.
 *
 * @param dateInput - The date to format. Accepts a Date object, string, or number.
 * @param variant - The desired format: 'iso' for YYYY-MM-DD or 'short' for 12 Apr, 2025. Defaults to 'iso'.
 * @param includeTime - If true, appends the time in HH:MM format. Defaults to false.
 * @returns The formatted date string.
 */
export const formatDate = (
  dateInput: Date | string | number,
  variant: DateFormatVariant = 'iso',
  includeTime = false
): string => {
  const date = new Date(dateInput)

  const datePart = (() => {
    if (variant === 'short') {
      const day = date.getUTCDate()
      const monthName = shortMonths[date.getUTCMonth()]
      const year = date.getUTCFullYear()
      return `${day} ${monthName}, ${year}`
    }
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })()

  if (includeTime) {
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    return `${datePart} ${hours}:${minutes}`
  }

  return datePart
}
