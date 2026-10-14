import { describe, it, expect } from 'vitest'
import { VisitorKey } from './VisitorKey.js'

const CHROME_ON_WINDOWS =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

describe('VisitorKey', () => {
  it('builds the same key for two visits from the same browser and address', () => {
    const first = new VisitorKey({ ipAddress: '83.250.10.4', userAgent: CHROME_ON_WINDOWS })
    const second = new VisitorKey({ ipAddress: '83.250.10.4', userAgent: CHROME_ON_WINDOWS })

    expect(first.toString()).toBe(second.toString())
  })

  it('builds different keys for two different addresses', () => {
    const first = new VisitorKey({ ipAddress: '83.250.10.4', userAgent: CHROME_ON_WINDOWS })
    const second = new VisitorKey({ ipAddress: '90.230.1.7', userAgent: CHROME_ON_WINDOWS })

    expect(first.toString()).not.toBe(second.toString())
  })

  it('builds different keys for two different browsers', () => {
    const chrome = new VisitorKey({ ipAddress: '83.250.10.4', userAgent: CHROME_ON_WINDOWS })
    const firefox = new VisitorKey({
      ipAddress: '83.250.10.4',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0',
    })

    expect(chrome.toString()).not.toBe(firefox.toString())
  })

  it('treats the IPv6 and IPv4 notations of localhost as the same address', () => {
    const ipv6 = new VisitorKey({ ipAddress: '::1', userAgent: CHROME_ON_WINDOWS })
    const ipv4 = new VisitorKey({ ipAddress: '127.0.0.1', userAgent: CHROME_ON_WINDOWS })

    expect(ipv6.toString()).toBe(ipv4.toString())
  })

  it('treats an IPv4-mapped address as the plain IPv4 address', () => {
    const mapped = new VisitorKey({ ipAddress: '::ffff:83.250.10.4', userAgent: CHROME_ON_WINDOWS })
    const plain = new VisitorKey({ ipAddress: '83.250.10.4', userAgent: CHROME_ON_WINDOWS })

    expect(mapped.toString()).toBe(plain.toString())
  })

  it('ignores surrounding whitespace and letter case in the address', () => {
    const messy = new VisitorKey({ ipAddress: '  ::FFFF:83.250.10.4 ', userAgent: CHROME_ON_WINDOWS })
    const plain = new VisitorKey({ ipAddress: '83.250.10.4', userAgent: CHROME_ON_WINDOWS })

    expect(messy.toString()).toBe(plain.toString())
  })

  it('uses a placeholder instead of undefined when no address is given', () => {
    const key = new VisitorKey({ userAgent: CHROME_ON_WINDOWS }).toString()

    expect(key).not.toContain('undefined')
    expect(key).toContain('unknown-address')
  })
})
