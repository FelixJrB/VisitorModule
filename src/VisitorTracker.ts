import { Visitor } from './Visitor.js'

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
}
