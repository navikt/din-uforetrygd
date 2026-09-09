import { Chart, XAxis, YAxis } from '@highcharts/react'
import { ColumnSeries } from '@highcharts/react/series/Column'
import { formatInntekt } from '@/utils/formatter/formatter'

const FONT_SIZE = '14px'
const FONT_FAMILY = 'var(--ax-font-family)'
const BLÅ_FARGE = '#005B82'
const GRØNN_FARGE = '#2AA758'

const COLUMN_STYLE = {
  states: {
    hover: { enabled: false },
    inactive: { opacity: 1 },
  },
}

type SeriesWithDivider = Highcharts.Series & {
  group?: Highcharts.SVGElement
  dividerGroup?: Highcharts.SVGElement
  dividerLines?: Highcharts.SVGElement[]
  dividerFrame?: number
}
interface Props {
  inntektTall: number[]
  uføretrygdTall: number[]
  descriptionId: string
}

export default function InntektSimuleringGraf({ inntektTall, uføretrygdTall, descriptionId }: Props) {
  const formaterYAkseNummer = (value: string) => {
    if (value.length > 3) {
      return formatInntekt(Number.parseInt(value.substring(0, value.length - 3), 10))
    }
    return formatInntekt(Number.parseInt(value, 10))
  }

  return (
    <div aria-describedby={descriptionId} aria-roledescription="søylediagram" role="img">
      <Chart
        margin={[100, 0]}
        height={400}
        title=""
        credits=""
        options={{
          palette: {
            colorScheme: 'light',
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              pointPadding: 0.1,
              groupPadding: 0.1,
              maxPointWidth: 200,
              borderRadius: 10,
            },
          },
          legend: {
            x: -8,
            align: 'left',
            verticalAlign: 'top',
            itemStyle: {
              fontSize: '16px',
              cursor: 'auto',
            },
          },
          chart: {
            events: {
              // legger til den hvite linja mellom inntekt og uføretrygd, og sørger for at den følger animasjonen.
              render(this: Highcharts.Chart) {
                const uføretrygd = this.get('uforetrygd') as SeriesWithDivider | undefined
                if (!uføretrygd?.group) return

                if (!uføretrygd.dividerGroup) {
                  uføretrygd.dividerGroup = this.renderer.g('stack-dividers').attr({ zIndex: 1 }).add(uføretrygd.group)
                  uføretrygd.dividerLines = []
                }

                const syncDividers = () => {
                  let animerer = false

                  uføretrygd.points.forEach((point, index) => {
                    const shape = point.shapeArgs
                    const divider = uføretrygd.dividerLines?.[index]
                    if (!shape || !divider) return

                    // Read the animated SVG shape, rather than Highcharts' target shape.
                    const box = point.graphic?.getBBox()
                    const x = box?.x ?? shape.x
                    const y = box?.y ?? shape.y
                    const width = box?.width ?? shape.width
                    divider.attr({ d: ['M', x, y, 'L', x + width, y] })

                    if (Math.abs(y - shape.y) > 0.1) animerer = true
                  })

                  if (animerer) uføretrygd.dividerFrame = requestAnimationFrame(syncDividers)
                }

                uføretrygd.points.forEach((point, index) => {
                  if (!point.shapeArgs || uføretrygd.dividerLines?.[index]) return

                  const line = this.renderer
                    .path([])
                    .attr({ stroke: '#fff', 'stroke-width': 5 })
                    .add(uføretrygd.dividerGroup)
                  uføretrygd.dividerLines?.push(line)
                })

                uføretrygd.dividerLines?.splice(uføretrygd.points.length).forEach((line) => {
                  line.destroy()
                })
                if (uføretrygd.dividerFrame) cancelAnimationFrame(uføretrygd.dividerFrame)
                syncDividers()
              },
            },
          },
        }}
      >
        <XAxis
          categories={['Uten inntekt', 'Med inntekt']}
          labels={{ style: { fontSize: FONT_SIZE, fontWeight: '600' } }}
        />
        <YAxis
          min={0}
          max={500000}
          maxPadding={0.1}
          title={{
            align: 'high',
            offset: -40,
            rotation: 0,
            text: 'Tusen kroner',
            y: -30,
            style: { fontSize: FONT_SIZE, fontFamily: FONT_FAMILY },
          }}
          stackLabels={{
            enabled: true,
            formatter(this: Highcharts.StackItemObject) {
              return `${formatInntekt(this.total)} kr`
            },
            style: {
              fontSize: FONT_SIZE,
              fontWeight: '600',
              fontFamily: FONT_FAMILY,
              align: 'center',
            },
          }}
          labels={{
            style: { fontSize: FONT_SIZE, fontFamily: FONT_FAMILY },
            formatter: ({ value }: { value: string | number }) => formaterYAkseNummer(value.toString()),
          }}
        ></YAxis>
        <ColumnSeries data={inntektTall} name="Kims inntekt" color={GRØNN_FARGE} options={COLUMN_STYLE} />
        <ColumnSeries
          id="uforetrygd"
          data={uføretrygdTall}
          name="Kims uføretrygd"
          color={BLÅ_FARGE}
          options={COLUMN_STYLE}
        />
      </Chart>
    </div>
  )
}
