/** 3800 -> "$38", 3850 -> "$38.50" */
export function usd(cents: number) {
  const whole = cents % 100 === 0
  return (
    (cents < 0 ? '-' : '') +
    '$' +
    (Math.abs(cents) / 100).toLocaleString('en-US', {
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2,
    })
  )
}
