'use client'

import { Heading, Pagination, Tabs, VStack } from '@navikt/ds-react'
import React, { useState } from 'react'
import { Behandling } from '@/sections/Saksoversikt/Behandling'
import { SaksoversiktType } from '@/sections/Saksoversikt/saksoversiktType'
import { IngenBehandlinger } from '@/sections/Saksoversikt/IngenBehandlinger'
import Brødsmulesti from '@/components/Brødsmulesti/Brødsmulesti'

interface Saksoversikt {
  saksoversikt: SaksoversiktType
  mode: string | undefined
}

export const Saksoversikt: React.FC<Saksoversikt> = ({ saksoversikt, mode }) => {
  const [currentPage, setCurrentPage] = useState(saksoversikt.avsluttedeBehandlinger.length > 0 ? 1 : 0)
  const antallBehandlingerPerSide = 5
  const antallSider = Math.ceil(saksoversikt.avsluttedeBehandlinger.length / antallBehandlingerPerSide)

  return (
    <section>
      <VStack gap="space-24">
        <Brødsmulesti mode={mode} />
        <Heading size="large" level="2">
          Saksoversikt
        </Heading>
        <Tabs defaultValue="aktive">
          <VStack gap="space-32">
            <Tabs.List>
              <Tabs.Tab value="aktive" label="Til behandling"></Tabs.Tab>
              <Tabs.Tab value="avsluttede" label="Ferdig behandlet"></Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="aktive">
              {saksoversikt.aktiveBehandlinger.length > 0 ? (
                saksoversikt.aktiveBehandlinger.map((aktivBehandling) => (
                  <Behandling behandling={aktivBehandling} aktiv={true}></Behandling>
                ))
              ) : (
                <IngenBehandlinger aktiv={true} />
              )}
            </Tabs.Panel>
            <Tabs.Panel value="avsluttede">
              {saksoversikt.avsluttedeBehandlinger.length > 0 ? (
                saksoversikt.avsluttedeBehandlinger
                  .slice(antallBehandlingerPerSide * (currentPage - 1), antallBehandlingerPerSide * currentPage)
                  .map((behandling) => <Behandling behandling={behandling} key={behandling.vedtakId} aktiv={false} />)
              ) : (
                <IngenBehandlinger aktiv={false} />
              )}
              {antallSider > 1 && (
                <Pagination
                  page={currentPage}
                  onPageChange={setCurrentPage}
                  count={antallSider}
                  boundaryCount={1}
                  siblingCount={1}
                  prevNextTexts
                />
              )}
            </Tabs.Panel>
          </VStack>
        </Tabs>
      </VStack>
    </section>
  )
}
