import { expect, describe, it, test } from 'vitest'
import { Visitor } from './Visitor.js'

/**
 * Test file for Visitor class.
 *
 * @see https://vitest.dev/guide/learn/writing-tests.html
 */

test('Visitor data is created and visible', () => {
  const visitor1 = new Visitor({
    uniqueId: 1,
    ipAddress: '1.2.3.4.5.6.7',
    location: 'Stockholm, Sweden',
    deviceType: 'Desktop',
    operatingSystem: 'Windows',
  })
  expect(visitor1.location).toBe('Stockholm, Sweden')
})

test('Visitor data is created and visible', () => {
  const visitor2 = new Visitor({
    uniqueId: 2,
    ipAddress: '777.777',
    location: 'Norway, Oslo',
    deviceType: 'Mobile',
    operatingSystem: 'MacOs',
  })
  expect(visitor2.location).toBe('Norway, Oslo')
})




const visitor2 = new Visitor({
  uniqueId: 2,
  ipAddress: '777.777',
  location: 'Norway, Oslo',
  deviceType: 'Mobile',
  operatingSystem: 'MacOs',
})

console.log(visitor2)
console.table(visitor2)

console.table(visitor2, ['uniqueId', 'ipAddress', 'location', 'deviceType', 'operatingSystem'])
console.table([visitor2])
