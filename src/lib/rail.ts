// label position on the 4%–88% stretch of the rail, never more than 15% apart
export const railTop = (index: number, count: number): string =>
  `${Math.round(4 + index * Math.min(15, 84 / Math.max(1, count - 1)))}%`
