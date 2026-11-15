/** Draws a letter grid as crisp pixels. Neighbouring pixels of one colour merge into one rect. */
export function PixelSprite({
  grid,
  colors,
  px = 6,
  label,
  className = '',
}: {
  grid: (string | string[])[]
  colors: Record<string, string>
  /** Size of one pixel on screen. */
  px?: number
  /** Read out by screen readers; leave empty for decoration. */
  label?: string
  className?: string
}) {
  const w = Math.max(...grid.map((r) => r.length))
  const rects: { x: number; y: number; n: number; fill: string }[] = []
  grid.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const fill = colors[row[x]]
      let n = 1
      while (x + n < row.length && row[x + n] === row[x]) n++
      if (fill) rects.push({ x, y, n, fill })
      x += n
    }
  })
  return (
    <svg
      className={`pixel shrink-0 ${className}`}
      width={w * px}
      height={grid.length * px}
      viewBox={`0 0 ${w} ${grid.length}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.n} height={1} fill={r.fill} />
      ))}
    </svg>
  )
}
