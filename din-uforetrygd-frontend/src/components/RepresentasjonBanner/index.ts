'use client'
import dynamic from 'next/dynamic'

const RepresentasjonBanner = dynamic(() => import('./RepresentasjonBanner'), { ssr: false })

export default RepresentasjonBanner
