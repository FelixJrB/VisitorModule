type VisitorData = {
  uniqueId: string
  ipAdress: string
  location: string
  deviceType: string
  operatingSystem: OperatingSystem
}

type OperatingSystem = 'Windows' | 'MacOs' | 'Linux' | 'Unknown'

/**
 *
 */
export class Visitor {
  readonly uniqueId: string
  readonly ipAdress: string
  readonly location: string
  readonly deviceType: string
  readonly operatingSystem: OperatingSystem

  /**
   *
   * @param visitor
   */
  constructor(visitor: VisitorData) {
    this.uniqueId = visitor.uniqueId
    this.ipAdress = visitor.ipAdress
    this.location = visitor.location
    this.deviceType = visitor.deviceType
    this.operatingSystem = visitor.operatingSystem
  }
}
