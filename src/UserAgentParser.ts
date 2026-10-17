import { type DeviceType, type OperatingSystem } from './types.js'

/**
 * A Parsing class that analyzes user agent strings to determine the device type of a visitor.
 *
 */
export class UserAgentParser {
  /**
   * Checks the user agent string to determine the device type of the visitor.
   *
   * The method analyzes the user agent string for specific keywords that indicate the type of device being used.
   *
   * @param userAgent The user agent string to parse.
   * @returns the found device type else it returns 'Unknown'
   */
  parseDeviceType(userAgent: string): DeviceType {
    // Convert the user agent string to lowercase for case-insensitive comparison
    const userAgentDevice = userAgent.toLowerCase()
    if (userAgentDevice.includes('smarttv') || userAgentDevice.includes('smart-tv')) {
      return 'Tv'
    } else if (
      userAgentDevice.includes('tablet') ||
      userAgentDevice.includes('ipad') ||
      this.isAndroidTablet(userAgentDevice)
    ) {
      return 'Tablet'
    } else if (
      userAgentDevice.includes('mobi') ||
      userAgentDevice.includes('iphone') ||
      userAgentDevice.includes('android')
    ) {
      return 'Mobile'
    } else if (
      userAgentDevice.includes('windows') ||
      userAgentDevice.includes('macintosh') ||
      userAgentDevice.includes('linux')
    ) {
      return 'Desktop'
    } else {
      return 'Unknown'
    }
  }

  /**
   * Parses the operating system from a user agent string.
   *
   * Checks for specific keywords in the user agent string to determine the operating system.
   *
   * @param userAgent The user agent string to parse.
   * @returns the found operating system else it returns 'Unknown'
   */
  parseOperatingSystem(userAgent: string): OperatingSystem {
    const userAgentOS = userAgent.toLowerCase()
    if (userAgentOS.includes('iphone') || userAgentOS.includes('ipad')) {
      return 'IOS'
    } else if (userAgentOS.includes('android')) {
      return 'Android'
    } else if (userAgentOS.includes('windows')) {
      return 'Windows'
    } else if (userAgentOS.includes('macintosh')) {
      return 'MacOs'
    } else if (userAgentOS.includes('linux')) {
      return 'Linux'
    } else {
      return 'Unknown'
    }
  }

  /**
   * Tells whether the visit was made by a bot rather than by a person.
   *
   * Search engines, link previews in chat apps and uptime monitors all request pages the
   * same way a browser does, and they make up a large part of the traffic to a public
   * site. They identify themselves in the user agent, which is what this looks for.
   *
   * @param userAgent - The user agent string to check.
   * @returns True when the user agent identifies itself as a bot.
   */
  isBot(userAgent: string): boolean {
    const userAgentBot = userAgent.toLowerCase()

    for (const marker of BOT_MARKERS) {
      if (userAgentBot.includes(marker)) {
        return true
      }
    }

    return false
  }

  /**
   * Tells whether an Android device is a tablet rather than a phone.
   *
   * Android tablets say `Android` without saying `Mobi`, which is the only thing that
   * separates them from phones. Google documents this as the way to tell them apart.
   *
   * @param userAgent - The user agent string, already in lower case.
   * @returns True when the user agent is an Android tablet.
   */
  private isAndroidTablet(userAgent: string): boolean {
    return userAgent.includes('android') && !userAgent.includes('mobi')
  }
}

/**
 * The words bots use to identify themselves in a user agent string. Kept as a list so that
 * new ones can be added without touching the logic that uses them.
 */
const BOT_MARKERS = ['bot', 'crawler', 'spider', 'slurp', 'preview', 'facebookexternalhit', 'headlesschrome', 'monitor']
