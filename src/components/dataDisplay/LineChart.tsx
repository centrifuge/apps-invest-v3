import { useMemo } from 'react'
import { Box, useToken } from '@chakra-ui/react'
import { ResponsiveContainer, ComposedChart, Line, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { ChartTooltip } from '@ui'

type Accessor<T> = (row: T) => number

type SeriesConfig<T> = {
  id: string
  type: 'line' | 'bar'
  accessor: Accessor<T>
  colorToken?: string
  strokeWidth?: number
  barSize?: number
}

type LineChartProps<T> = {
  data: T[]
  xAccessor: (row: T) => string | Date
  series: SeriesConfig<T>[]
  height?: number | string
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
  xTickFormatter?: (x: string) => string
  yTickFormatter?: (y: number) => string
  tooltipYTickFormatter?: (y: number) => string
  yDomain?: (string | number)[]
  showGrid?: boolean
  showTooltip?: boolean
}

export function LineChart<T>({
  data,
  xAccessor,
  series,
  height = 200,
  margin = { top: 0, right: 10, bottom: 0, left: -20 },
  xTickFormatter,
  yTickFormatter = (v) => String(v),
  tooltipYTickFormatter = (v) => String(v),
  yDomain = [0, 100],
  showGrid = true,
  showTooltip = true,
}: LineChartProps<T>) {
  // Build a token list: border + text + each series color (fallbacks included)
  const seriesTokens = series.map((s, i) => s.colorToken ?? (i === 0 ? 'text-highlight' : 'bg-tertiary'))
  const [borderPrimary, textSecondary, ...seriesColors] = useToken('colors', [
    'border-primary',
    'text-secondary',
    ...seriesTokens,
  ])

  const defaultFormatMonth = (x: string) => new Date(x).toLocaleString('en-US', { month: 'short', year: 'numeric' })

  // Normalize raw rows into { timestamp, [series.id]: number }
  const normalized = useMemo(() => {
    return data.map((row) => {
      const x = xAccessor(row)
      const point: Record<string, unknown> = {
        timestamp: typeof x === 'string' ? x : x.toISOString(),
      }
      for (const s of series) point[s.id] = s.accessor(row)
      return point
    })
  }, [data, xAccessor, series])

  return (
    <Box height={height} width="100%">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={normalized} margin={margin}>
          {showGrid && <CartesianGrid stroke={borderPrimary} vertical={false} />}
          <XAxis
            dataKey="timestamp"
            tickFormatter={xTickFormatter ?? defaultFormatMonth}
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '10px', fill: textSecondary }}
          />
          <YAxis
            domain={yDomain as any}
            tickFormatter={yTickFormatter}
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '10px', fill: textSecondary }}
          />
          {showTooltip && (
            <Tooltip
              content={
                <ChartTooltip
                  borderColor={borderPrimary}
                  xFormatter={(x: string) =>
                    new Date(x)
                      .toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })
                      .toUpperCase()
                  }
                  yFormatter={tooltipYTickFormatter}
                />
              }
              wrapperStyle={{ width: '298px', boxShadow: '1px 3px 6px rgba(0, 0, 0, 0.15)', borderRadius: '8px' }}
              contentStyle={{ borderRadius: '8px', padding: 0, border: 'none' }}
            />
          )}

          {series.map((s, i) =>
            s.type === 'bar' ? (
              <Bar
                key={s.id}
                dataKey={s.id}
                barSize={s.barSize ?? 20}
                fill={seriesColors[i]}
                fillOpacity={1}
                strokeWidth={0}
              />
            ) : (
              <Line
                key={s.id}
                type="monotone"
                dataKey={s.id}
                stroke={seriesColors[i]}
                strokeWidth={s.strokeWidth ?? 2}
                dot={false}
              />
            )
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  )
}
