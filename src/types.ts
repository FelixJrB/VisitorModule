/**
 * What a visit is made up of before anything has been worked out from it: the address the
 * request came from, the browser that sent it, and optionally where that address is.
 *
 * The place is left to the caller, since an address holds no location in itself. Resolving
 * one means asking a service or reading a database, which this module does not do.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 */
export type VisitRequest = {
  ipAddress?: string
  userAgent: string
  location?: string
}

/** The kinds of device a visit can be made from. */
export type DeviceType = 'Desktop' | 'Mobile' | 'Tablet' | 'Tv' | 'Unknown'

/** The operating systems a visit can be made from. */
export type OperatingSystem = 'Windows' | 'MacOs' | 'IOS' | 'Android' | 'Linux' | 'Unknown'
