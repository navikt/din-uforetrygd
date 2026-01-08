'use client'

import { Heading, Pagination, Tabs, VStack } from '@navikt/ds-react'
import React, { useState } from 'react'
import { Behandling } from '@/sections/Saksoversikt/Behandling'
import { SaksoversiktType } from '@/sections/Saksoversikt/saksoversiktType'
import { IngenBehandlinger } from '@/sections/Saksoversikt/IngenBehandlinger'

interface Saksoversikt {
  saksoversikt: SaksoversiktType
}

export const Saksoversikt: React.FC<Saksoversikt> = ({ saksoversikt }) => {
  //TODO: sjekk ut client vs server
  //TODO: figma må oppdateres med Tabs.Panel?
  //TODO: sasa: har gjort en antagelse om at ingenbehandlinger trengs også for avsluttede
  //TODO: bytt ut idx med kravid/bruk key for behandling

  const [currentPage, setCurrentPage] = useState(saksoversikt.avsluttedeBehandlinger.length > 0 ? 1 : 0)
  const antallBehandlingerPerSide = 5
  const antallSider = Math.ceil(saksoversikt.avsluttedeBehandlinger.length / antallBehandlingerPerSide)

  return (
    <section>
      <VStack gap="6">
        <Heading size="large" level="2">
          Saksoversikt
        </Heading>
        <Tabs defaultValue="aktive">
          <Tabs.List>
            <Tabs.Tab value="aktive" label="Aktive behandlinger"></Tabs.Tab>
            <Tabs.Tab value="avsluttede" label="Avsluttede behandlinger"></Tabs.Tab>
          </Tabs.List>
          <div style={{ marginTop: '3rem' }}>
          <Tabs.Panel value="aktive">
            {saksoversikt.aktivBehandling ? (
              <Behandling behandling={saksoversikt.aktivBehandling} aktiv={true}></Behandling>
            ) : (
              <IngenBehandlinger aktiv={true}/>
            )}
          </Tabs.Panel>
          <Tabs.Panel value="avsluttede">
            {saksoversikt.avsluttedeBehandlinger.length > 0 ? (
              saksoversikt.avsluttedeBehandlinger.slice(antallBehandlingerPerSide * (currentPage-1), antallBehandlingerPerSide * currentPage).map((behandling) => (
                <Behandling behandling={behandling} aktiv={false} />
              ))
            ) : (
              <IngenBehandlinger aktiv={false}/>
            )}
              <Pagination
              page={currentPage}
              onPageChange={setCurrentPage}
              count={antallSider}
              boundaryCount={1}
              siblingCount={1}
              prevNextTexts
            />
          </Tabs.Panel>
          </div>
        </Tabs>
      </VStack>
    </section>
  )
}
