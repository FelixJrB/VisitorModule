import { type DeviceType, type OperatingSystem } from './types.js'

/**
 * Everything a visitor is made of, once it has been worked out from a visit.
 */
type VisitorData = {
  uniqueId: number
  ipAddress?: string
  location: string
  deviceType: DeviceType
  operatingSystem: OperatingSystem
}

/**
 * One visitor to the site.
 *
 * A visitor is settled when it is created and never changes afterwards, so the same
 * visitor can be handed out again on a later visit without anyone being able to alter it.
 */
export class Visitor {
  readonly uniqueId: number
  readonly ipAddress?: string
  readonly location: string
  readonly deviceType: DeviceType
  readonly operatingSystem: OperatingSystem

  /**
   * Creates a visitor from what was worked out about a visit.
   *
   * @param visitor - The id, address, place, device and system of the visitor.
   */
  constructor(visitor: VisitorData) {
    this.uniqueId = visitor.uniqueId
    this.ipAddress = visitor.ipAddress
    this.location = visitor.location
    this.deviceType = visitor.deviceType
    this.operatingSystem = visitor.operatingSystem
  }
}
