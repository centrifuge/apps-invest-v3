/**
 * Function to to get the number of decimal places in a number.
 * @param {number} num The number provided to find its decimal places.
 */
function getDecimalPlaces(num: number) {
  const numString = String(num)
  const decimalIndex = numString.indexOf('.')

  if (decimalIndex === -1) {
    return 0
  }

  return numString.length - decimalIndex - 1
}

/**
 * Function to handle rounding a number to a specified number of decimal places.
 * @param {number} num The number to round.
 * @param {number | undefined} [decimalPlaces] The number of decimal places to round to.
 * If decimalPlaces not provided, the function will determine it automatically.
 */
export function roundToDecimal(num: number, decimalPlaces?: number) {
  let placesToRound = decimalPlaces

  if (placesToRound === undefined) {
    if (getDecimalPlaces(num) >= 3) {
      placesToRound = 2
    } else {
      placesToRound = getDecimalPlaces(num)
    }
  }

  if (!Number.isInteger(placesToRound) || placesToRound < 0) {
    console.error('Invalid decimalPlaces argument. Must be a non-negative integer or undefined.')
    return NaN
  }

  // Create a multiplier (e.g., 10 for 1 decimal place, 100 for 2)
  const multiplier = Math.pow(10, placesToRound)

  return Math.round(num * multiplier) / multiplier
}
