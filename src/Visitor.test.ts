import { expect, describe, it } from 'vitest'
import { Visitor } from './Visitor.js'

/**
 * Test file for Visitor class.
 *
 * @see https://vitest.dev/guide/learn/writing-tests.html
 */

describe('Visitor', () => {
  it('stores the location it was given correctly', () => {
    const visitor1 = new Visitor({
      uniqueId: 1,
      ipAddress: '1.2.3.4.5.6.7',
      location: 'Stockholm, Sweden',
      deviceType: 'Desktop',
      operatingSystem: 'Windows',
    })
    expect(visitor1.location).toBe('Stockholm, Sweden')
  })

  it('has an undefined IP address when not provided', () => {
    const visitor2 = new Visitor({
      uniqueId: 2,
      location: 'Norway, Oslo',
      deviceType: 'Mobile',
      operatingSystem: 'MacOs',
    })
    expect(visitor2.ipAddress).toBeUndefined()
  })

  it('stores the IP address when provided', () => {
    const visitor3 = new Visitor({
      uniqueId: 3,
      ipAddress: '777.777',
      location: 'Norway, Oslo',
      deviceType: 'Mobile',
      operatingSystem: 'MacOs',
    })
    expect(visitor3.ipAddress).toBe('777.777')
  })
})
