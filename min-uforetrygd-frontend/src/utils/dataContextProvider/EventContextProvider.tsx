'use client'

import React, {createContext, ReactNode, useState} from 'react'

interface EventContextType {
  setOpenHendelser: (value: boolean) => void
  openHendelser: boolean
}

const EventContextDefaultValue: EventContextType = {
  setOpenHendelser: () => undefined,
  openHendelser: false
}

export const EventContext = createContext(EventContextDefaultValue)

interface EventProviderProps {
  children?: ReactNode
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {

  const [openHendelser, setOpenHendelser] = useState(false)


  return (
    <EventContext.Provider value={{
      openHendelser,
      setOpenHendelser
    }}>
      {children}
    </EventContext.Provider>
  )
}

export default EventProvider
