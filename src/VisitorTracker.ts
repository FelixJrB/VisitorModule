import { Visitor } from './Visitor.js'
import { UserAgentParser } from './UserAgentParser.js'

/**
 * A type representing visitor information, including an optional IP address and a user agent string.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 */
type VisitRequest = {
  ipAddress?: string
  userAgent: string
}

/**
 * A class representing a visitor tracker that manages a collection of visitors.
 *
 * The VisitorTracker class maintains a unique ID and a map of visitors, allowing for the tracking and management of visitor data.
 */
export class VisitorTracker {
  private lastAssignedId: number
  private visitors = new Map<string, Visitor>()
  private parser = new UserAgentParser()

  /**
   * Constructor for the VisitorTracker class.
   *
   * Initializes a new instance of the VisitorTracker class with a unique ID.
   * The unique ID is set to 0 by default.
   */
  constructor() {
    this.lastAssignedId = 0
  }

  /**
   * Gets all visitors tracked so far.
   *
   * @returns A map containing the visitors.
   */
  getVisitors() {
    return this.visitors
  }

  /**
   * Gets the number of unique visitors tracked so far.
   *
   * @returns The unique ID.
   */
  getUniqueId() {
    return this.lastAssignedId
  }

  /**
   * Gets the visitors size stored.
   *
   * @returns The count of visitors.
   */
  getVisitorCount() {
    return this.visitors.size
  }

  /**
   * Tracks the visitors in the siteVisitor map.
   *
   * If the visitor has not already visited the site, a new Visitor object is created and added to the map.
   *
   * @param request - An object containing visitor information, including an optional IP address and a user agent string.
   * @returns The visitor, either newly created or previously stored.
   */
  track(request: VisitRequest) {
    const key = request.userAgent + '|' + request.ipAddress
    const alreadyVisited = this.visitors.get(key)
    if (!alreadyVisited) {
      this.lastAssignedId++
      const visitor = new Visitor({
        uniqueId: this.lastAssignedId,
        ipAddress: request.ipAddress,
        location: 'Unknown',
        deviceType: this.parser.parseDeviceType(request.userAgent),
        operatingSystem: this.parser.parseOperatingSystem(request.userAgent),
      })
      this.visitors.set(key, visitor)
      return visitor
    }
    return alreadyVisited
  }
}
