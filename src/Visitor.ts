type VisitorData = {
  uniqueId: string
  ipAddress: string
  location: string
  deviceType: string
  operatingSystem: OperatingSystem
}

type OperatingSystem = 'Windows' | 'MacOs' | 'Linux' | 'Unknown'

/**
 * A class representing a visitor with various properties such as unique ID, IP address, location, device type, and operating system.
 */
export class Visitor {
  readonly uniqueId: string
  readonly ipAddress: string
  readonly location: string
  readonly deviceType: string
  readonly operatingSystem: OperatingSystem

  /**
   * Constructor for the Visitor class.
   *
   * Initializes a new instance of the Visitor class with the provided visitor data.
   *
   * @param visitor - Object data containing the visitor's unique data.
   */
  constructor(visitor: VisitorData) {
    this.uniqueId = visitor.uniqueId
    this.ipAddress = visitor.ipAddress
    this.location = visitor.location
    this.deviceType = visitor.deviceType
    this.operatingSystem = visitor.operatingSystem
  }
}
