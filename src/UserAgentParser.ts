import { type DeviceType, type OperatingSystem } from './Visitor.js'

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
    } else if (userAgentDevice.includes('tablet') || userAgentDevice.includes('ipad')) {
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
}
