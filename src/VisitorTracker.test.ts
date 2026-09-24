import { expect, describe, it } from 'vitest'
import { VisitorTracker } from './VisitorTracker.js'
import { Visitor } from './Visitor.js'

describe('VisitorTracker', () => {
  it('initializes with a unique ID of 0', () => {
    const tracker = new VisitorTracker()
    expect(tracker.getUniqueId()).toBe(0)
  })

  it('returns an empty map of visitors when initialized', () => {
    const tracker = new VisitorTracker()
    expect(tracker.getVisitors().size).toBe(0)
  })

  it('tracks a new visitor and adds it to the map', () => {
    const tracker = new VisitorTracker()
    const visitorInfo = { ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0' }
    const visitor = tracker.track(visitorInfo)
    expect(tracker.getVisitors().size).toBe(1)
    expect(visitor).toBeInstanceOf(Visitor)
  })

  it('tracks the same visitor again and does not create a new entry', () => {
    const tracker = new VisitorTracker()
    const visitorInfo = { ipAddress: '3.3.3.4', userAgent: 'Mozilla/5.0' }
    const firstVisitor = tracker.track(visitorInfo)
    const secondVisitor = tracker.track(visitorInfo)
    expect(tracker.getVisitors().size).toBe(1)
    expect(firstVisitor).toBe(secondVisitor)
  })

  it('tracks two visitors with different IP addresses as separate entries', () => {
    const tracker = new VisitorTracker()
    const firstVisitor = tracker.track({ ipAddress: '3.3.3.4', userAgent: 'Mozilla/5.0' })
    const secondVisitor = tracker.track({ ipAddress: '5.5.5.6', userAgent: 'Mozilla/5.0' })
    expect(tracker.getVisitors().size).toBe(2)
    expect(secondVisitor.uniqueId).not.toBe(firstVisitor.uniqueId)
  })
})
