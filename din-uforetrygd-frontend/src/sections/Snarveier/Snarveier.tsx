import { Innloggingstype, Visningskriterier } from '@/const'
import React from 'react'
import { SnarveiPanel } from '@/components/SnarveiPanel'
import { components } from '@/api/api'

interface SnarveierProps {
  visningskriterier: Visningskriterier[]
  pid: string | undefined
  uforetrygdResponse: components['schemas']['UforetrygdResponse']
}

export const Snarveier: React.FC<SnarveierProps> = async ({ visningskriterier, pid, uforetrygdResponse }) => {
  return (
    <section aria-label="Snarveier">
      <SnarveiPanel
        visningskriterier={visningskriterier}
        pid={pid}
        bprofFullmakt={uforetrygdResponse.harGammelFullmaktmottaker!}
        innloggingstype={uforetrygdResponse.innloggingstype as Innloggingstype}
        top={false}
      />
    </section>
  )
}
