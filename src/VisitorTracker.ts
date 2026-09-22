import { Visitor } from './Visitor.js'

/**
 * A type representing visitor information, including an optional IP address and a user agent string.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 */
type visitorInformation = {
  ipAddress?: string
  userAgent: string
}

/**
 * A class representing a visitor tracker that manages a collection of visitors.
 *
 * The VisitorTracker class maintains a unique ID and a map of visitors, allowing for the tracking and management of visitor data.
 */
export class VisitorTracker {
  private uniqueId: number
  private siteVisitor = new Map<string, Visitor>()

  /**
   * Constructor for the VisitorTracker class.
   *
   * Initializes a new instance of the VisitorTracker class with a unique ID.
   * The unique ID is set to 0 by default.
   */
  constructor() {
    this.uniqueId = 0
    this.siteVisitor
  }

  /**
   * Gets the visitors stored in the siteVisitor map.
   *
   * @returns A map containing the visitors.
   */
  getVisitors() {
    return this.siteVisitor
  }

  /**
   * Gets the unique ID of the visitor tracker.
   *
   * @returns The unique ID.
   */
  getUniqueId() {
    return this.uniqueId
  }

  /**
   * Tracks the visitors in the siteVisitor map.
   *
   * If the visitor has not already visited the site, a new Visitor object is created and added to the map.
   *
   * @param request - An object containing visitor information, including an optional IP address and a user agent string.
   * @returns The visitor, either newly created or previously stored.
   */
  track(request: visitorInformation) {
    const key = request.userAgent + '|' + request.ipAddress
    const alreadyVisited = this.siteVisitor.get(key)
    if (!alreadyVisited) {
      this.uniqueId++
      const visitor = new Visitor({
        uniqueId: this.uniqueId,
        ipAddress: request.ipAddress,
        location: 'Unknown',
        deviceType: 'Unknown',
        operatingSystem: 'Unknown',
      })
      this.siteVisitor.set(key, visitor)
      return visitor
    }
    return alreadyVisited
  }
}
