import { Innloggingstype, Visningskriterier } from '@/const'
import React from 'react'
import { SnarveiPanel } from '@/components/SnarveiPanel'

interface InntektSnarveierProps {
  visningskriterier: Visningskriterier[]
  pid: string | undefined
  innloggingstype: Innloggingstype
}

export const InntektSnarveier: React.FC<InntektSnarveierProps> = async ({
  visningskriterier,
  pid,
  innloggingstype,
}) => {
  return (
    <section aria-label="Inntekt-snarveier">
      <SnarveiPanel
        heading="Meld fra om endring i inntekt"
        visningskriterier={visningskriterier}
        pid={pid}
        bprofFullmakt={false}
        innloggingstype={innloggingstype}
        top={true}
      />
    </section>
  )
}
