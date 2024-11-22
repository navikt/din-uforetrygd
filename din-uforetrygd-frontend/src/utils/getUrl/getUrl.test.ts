import { describe, expect, it, vi } from 'vitest'
import { getUrl, GetUrlInput } from '@/utils/getUrl/index'

const inputOnlyUrl: GetUrlInput = {
  urlFromEnv: 'LINK_SOKNAD_GRADERT_UFORE',
}

const inputFullmektig: GetUrlInput = {
  urlFromEnv: 'LINK_SOKNAD_GRADERT_UFORE',
  isFullmektig: true,
}

// const inputPidWithVeileder: GetUrlInput = {
//   urlFromEnv: 'LINK_SOKNAD_GRADERT_UFORE',
//   pid: '12345',
// }

describe('getUrl', () => {
  // beforeEach(() => {
  //   vi.clearAllMocks()
  // })

  it('should return url with query sub=digital when user is logged in as borger', async () => {
    vi.mock('@/utils/env', () => ({
      default: vi.fn((key) => {
        if (key === 'LINK_SOKNAD_GRADERT_UFORE') {
          return 'https://www.nav.no/soknad-gradert-uforetrygd'
        }
        if (key === 'MODE') {
          return 'borger'
        }
        return ''
      }),
    }))
    const actual = await getUrl(inputOnlyUrl)
    expect(actual).toBe('https://www.nav.no/soknad-gradert-uforetrygd?sub=digital')
  })

  it('should return url with query sub=papir when user is fullmektig', async () => {
    vi.mock('@/utils/env', () => ({
      default: vi.fn((key) => {
        if (key === 'LINK_SOKNAD_GRADERT_UFORE') {
          return 'https://www.nav.no/soknad-gradert-uforetrygd'
        }
        if (key === 'MODE') {
          return 'borger'
        }
        return ''
      }),
    }))
    const actual = await getUrl(inputFullmektig)
    expect(actual).toBe('https://www.nav.no/soknad-gradert-uforetrygd?sub=papir')
  })

  it('should return url with query sub=papir when user is logged in with innloggingstype LEVEL3', async () => {
    vi.mock('@/utils/env', () => ({
      default: vi.fn((key) => {
        if (key === 'LINK_SOKNAD_GRADERT_UFORE') {
          return 'https://www.nav.no/soknad-gradert-uforetrygd'
        }
        if (key === 'MODE') {
          return 'borger'
        }
        return ''
      }),
    }))
    const actual = await getUrl({
      urlFromEnv: 'LINK_SOKNAD_GRADERT_UFORE',
      innloggingstype: 'LEVEL3',
    })
    expect(actual).toBe('https://www.nav.no/soknad-gradert-uforetrygd?sub=papir')
  })
})
// TODO: Fix reset av mocking mellom hver test
// describe('getUrl with pid', () => {
//   it('should return url with pid and user name when user is logged in as veileder', async () => {
//     vi.mock('@/utils/getAzureUserPayload', () => ({
//       getAzureUserPayload: vi.fn(() =>
//         Promise.resolve({ NAVident: 'NAVident', name: 'Veileder', preferred_username: 'Veileder' })
//       ),
//     }))
//     vi.mock('@/utils/env', () => ({
//       default: vi.fn((key) => {
//         if (key === 'LINK_SOKNAD_GRADERT_UFORE') {
//           return 'https://www.nav.no/soknad-gradert-uforetrygd?pid=PID&user=USER'
//         }
//         if (key === 'MODE') {
//           return 'veileder'
//         }
//         return ''
//       }),
//     }))
//
//     const actual = await getUrl(inputPidWithVeileder)
//     expect(actual).toBe('https://www.nav.no/soknad-gradert-uforetrygd?pid=12345&user=Veileder')
//   })
// })
