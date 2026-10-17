import { describe, it, expect } from 'vitest'
import { UserAgentParser } from './UserAgentParser.js'
import { type DeviceType, type OperatingSystem } from './Visitor.js'

describe('UserAgentParser', () => {
  const parser = new UserAgentParser()

  it('should correctly parse device types from user agent strings', () => {
    const testCases: { userAgent: string; expectedDeviceType: DeviceType }[] = [
      { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', expectedDeviceType: 'Desktop' },
      { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', expectedDeviceType: 'Mobile' },
      { userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)', expectedDeviceType: 'Tablet' },
      {
        userAgent:
          'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
        expectedDeviceType: 'Mobile',
      },
      {
        userAgent:
          'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        expectedDeviceType: 'Tablet',
      },
      { userAgent: 'Mozilla/5.0 (SmartTV; Linux; Tizen 2.4)', expectedDeviceType: 'Tv' },
      { userAgent: 'Unknown User Agent', expectedDeviceType: 'Unknown' },
    ]

    testCases.forEach(({ userAgent, expectedDeviceType }) => {
      const deviceType = parser.parseDeviceType(userAgent)
      expect(deviceType).toBe(expectedDeviceType)
    })
  })

  it('should correctly parse operating systems from user agent strings', () => {
    const testCases: { userAgent: string; expectedOS: OperatingSystem }[] = [
      { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', expectedOS: 'Windows' },
      { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', expectedOS: 'MacOs' },
      { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', expectedOS: 'IOS' },
      { userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F)', expectedOS: 'Android' },
      { userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', expectedOS: 'Linux' },
      { userAgent: 'Unknown User Agent', expectedOS: 'Unknown' },
    ]

    testCases.forEach(({ userAgent, expectedOS }) => {
      const os = parser.parseOperatingSystem(userAgent)
      expect(os).toBe(expectedOS)
    })
  })

  it('should recognise bots and crawlers', () => {
    const bots = [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; YandexAccessibilityBot/3.0; +http://yandex.com/bots)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) HeadlessChrome/128.0.0.0',
    ]

    bots.forEach((userAgent) => {
      expect(parser.isBot(userAgent)).toBe(true)
    })
  })

  it('should not mistake a real browser for a bot', () => {
    const browsers = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0',
    ]

    browsers.forEach((userAgent) => {
      expect(parser.isBot(userAgent)).toBe(false)
    })
  })
})
