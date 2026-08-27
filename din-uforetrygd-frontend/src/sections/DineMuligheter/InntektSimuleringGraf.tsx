import { Chart, XAxis, YAxis } from '@highcharts/react'
import { ColumnSeries } from '@highcharts/react/series/Column'
import { formatInntekt } from '@/utils/formatter/formatter'

const FONT_SIZE = '14px'
const FONT_FAMILY = 'var(--ax-font-family)'
const BLÅ_FARGE = '#005B82'
const GRØNN_FARGE = '#2AA758'

const COLUMN_STYLE = {
  states: {
    hover: {
      enabled: false,
    },
    inactive: {
      opacity: 1,
    },
  },
}

interface Props {
  inntektTall: number[]
  uføretrygdTall: number[]
  description: string
  descriptionId: string
}

export default function InntektSimuleringGraf({ inntektTall, uføretrygdTall, description, descriptionId }: Props) {
  const formaterYAkseNummer = (value: string) => {
    if (value.length > 3) {
      return formatInntekt(Number.parseInt(value.substring(0, value.length - 3), 10))
    }
    return formatInntekt(Number.parseInt(value, 10))
  }

  return (
    <div aria-describedby={descriptionId} aria-label={description} aria-roledescription="søylediagram" role="img">
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
        <ColumnSeries data={uføretrygdTall} name="Kims uføretrygd" color={BLÅ_FARGE} options={COLUMN_STYLE} />
      </Chart>
    </div>
  )
}
