import { type VisitRequest } from './types.js'

/**
 * The lookup key that identifies one visitor.
 *
 * Two visits from the same browser and the same address produce the same key, which is how
 * a returning visitor is recognised. The address is normalised first, since the same
 * machine reaches a Node server in several notations.
 */
export class VisitorKey {
  private readonly normalizedIpAddress: string
  private readonly value: string

  /**
   * Builds the key for a single visit.
   *
   * @param visit - The address and user agent the visit was made from.
   */
  constructor(visit: VisitRequest) {
    this.normalizedIpAddress = this.normalizeIpAddress(visit.ipAddress)
    this.value = `${this.normalizedIpAddress}|${visit.userAgent}`
  }

  /**
   * The key in the form used to look the visitor up.
   *
   * @returns The normalised key.
   */
  toString(): string {
    return this.value
  }

  /**
   * The address of the visit, in one single notation.
   *
   * This is the form worth storing and showing, since the same machine otherwise appears
   * under several spellings.
   *
   * @returns The normalised address, or undefined when the visit had no address.
   */
  getIpAddress(): string | undefined {
    if (this.normalizedIpAddress === UNKNOWN_ADDRESS) {
      return undefined
    }
    return this.normalizedIpAddress
  }

  /**
   * Reduces the different notations of one address to a single form.
   *
   * An IPv4 address that reaches an IPv6 socket is reported as IPv4-mapped
   * (`::ffff:83.250.10.4`), and localhost is reported both as `::1` and as `127.0.0.1`.
   * Without this, one machine would be counted as several visitors.
   *
   * @param ipAddress - The address as reported by the server, if there was one.
   * @returns The normalised address, or a placeholder when no address was given.
   */
  private normalizeIpAddress(ipAddress?: string): string {
    if (!ipAddress) {
      return UNKNOWN_ADDRESS
    }

    const address = ipAddress.trim().toLowerCase()

    if (address === '::1') {
      return '127.0.0.1'
    }

    if (address.startsWith('::ffff:')) {
      return address.slice('::ffff:'.length)
    }

    return address
  }
}

/**
 * Stands in for the address when a visit was made without one, so that the key never
 * contains the text "undefined".
 */
const UNKNOWN_ADDRESS = 'unknown-address'
