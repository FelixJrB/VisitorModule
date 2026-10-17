import { Visitor } from './Visitor.js'
import { type VisitRequest } from './types.js'
import { UserAgentParser } from './UserAgentParser.js'
import { VisitorKey } from './VisitorKey.js'
import { VisitorNotifier, type NewVisitorListener } from './VisitorNotifier.js'

/**
 * Keeps track of the visitors to a site.
 *
 * A visitor is recognised by the address and browser the visit was made from, so the same
 * browser from the same address keeps its id across visits. Everything is kept in memory,
 * which means the visitors are lost when the process restarts.
 */
export class VisitorTracker {
  private lastAssignedId: number
  private visitors = new Map<string, Visitor>()
  private parser = new UserAgentParser()
  private notifier = new VisitorNotifier()

  /**
   * Creates a tracker with no visitors.
   */
  constructor() {
    this.lastAssignedId = 0
  }

  /**
   * Registers a function to call whenever someone visits for the first time.
   *
   * Returning visitors do not trigger it. Several functions can be registered, and they
   * are called in the order they were added.
   *
   * @param listener - The function to call with the new visitor.
   */
  onNewVisitor(listener: NewVisitorListener): void {
    this.notifier.add(listener)
  }

  /**
   * Gets every visitor tracked so far.
   *
   * The returned map is a copy, so changing it does not affect the tracker.
   *
   * @returns A copy of the tracked visitors, keyed by their internal lookup key.
   */
  getVisitors() {
    return new Map(this.visitors)
  }

  /**
   * Gets a single visitor by the id they were given.
   *
   * @param id - The id to look for.
   * @returns The visitor with that id, or undefined when no visitor has it.
   */
  getVisitorById(id: number): Visitor | undefined {
    for (const visitor of this.visitors.values()) {
      if (visitor.uniqueId === id) {
        return visitor
      }
    }
    return undefined
  }

  /**
   * Gets the id that was given to the most recently created visitor.
   *
   * @deprecated Since 0.2.0. The name reads as if it returns a visitor's own id, but the
   *   value is the one handed out most recently, and it changes every time a new visitor
   *   arrives. To get a visitor's id, read `uniqueId` on the visitor returned by
   *   {@link track}, or look the visitor up with {@link getVisitorById}. The method is
   *   kept so that existing code keeps working.
   * @returns The last assigned id, or 0 when no visitor has been tracked yet.
   */
  getUniqueId() {
    return this.lastAssignedId
  }

  /**
   * Gets the number of unique visitors tracked so far.
   *
   * @returns The number of visitors.
   */
  getVisitorCount() {
    return this.visitors.size
  }

  /**
   * Tracks a visit to the site.
   *
   * A visit from an address and browser that has been seen before returns the existing
   * visitor, so the id stays the same. Any other visit creates and stores a new visitor.
   *
   * @param request - The address and user agent the visit was made from.
   * @returns The visitor, either newly created or previously stored.
   */
  track(request: VisitRequest) {
    const key = new VisitorKey(request)
    const alreadyVisited = this.visitors.get(key.toString())
    if (alreadyVisited) {
      return alreadyVisited
    }
    return this.registerNewVisitor(key, request)
  }

  /**
   * Creates a visitor for a visit that has not been seen before, and stores it.
   *
   * @param key - The key the visitor is recognised and stored by.
   * @param request - The address and user agent the visit was made from.
   * @returns The newly created visitor.
   */
  private registerNewVisitor(key: VisitorKey, request: VisitRequest): Visitor {
    this.lastAssignedId++
    const visitor = new Visitor({
      uniqueId: this.lastAssignedId,
      ipAddress: key.getIpAddress(),
      location: request.location ?? 'Unknown',
      deviceType: this.parser.parseDeviceType(request.userAgent),
      operatingSystem: this.parser.parseOperatingSystem(request.userAgent),
    })
    this.visitors.set(key.toString(), visitor)
    this.notifier.announce(visitor)
    return visitor
  }
}
