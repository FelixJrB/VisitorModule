import { Visitor, VisitorTracker, type DeviceType } from '../src/index.js'

/**
 * Renders the page the test app serves.
 *
 * Only reads from the tracker, never changes it, so the page can be rendered as often as
 * needed without affecting the numbers it shows.
 */
export class VisitorPage {
  private readonly tracker: VisitorTracker

  /**
   * Creates a page for one tracker.
   *
   * @param tracker - The tracker to read the visitors from.
   */
  constructor(tracker: VisitorTracker) {
    this.tracker = tracker
  }

  /**
   * Builds the whole page.
   *
   * @param currentVisitor - The visitor the page is being shown to, if it was tracked.
   * @returns The page as HTML.
   */
  render(currentVisitor?: Visitor): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>visitor-module test app</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <main>
      <h1>visitor-module</h1>
      <p class="subtitle">Test app for the module. Reload, or open the page in another browser.</p>
      ${this.renderCards()}
      ${this.renderCurrentVisitor(currentVisitor)}
      ${this.renderVisitorTable()}
      <footer>Visitors are kept in memory, so the list is empty again after a restart.</footer>
    </main>
  </body>
</html>`
  }

  /**
   * Builds the row of summary numbers.
   *
   * @returns The cards as HTML.
   */
  private renderCards(): string {
    return `<section class="cards">
      ${this.renderCard(this.tracker.getVisitorCount(), 'unique visitors')}
      ${this.renderCard(this.countDevices('Desktop'), 'desktop')}
      ${this.renderCard(this.countDevices('Mobile'), 'mobile')}
      ${this.renderCard(this.countDevices('Tablet'), 'tablet')}
    </section>`
  }

  /**
   * Counts the visitors using one kind of device.
   *
   * @param deviceType - The device type to count.
   * @returns The number of visitors on that device.
   */
  private countDevices(deviceType: DeviceType): number {
    return this.allVisitors().filter((visitor) => visitor.deviceType === deviceType).length
  }

  /**
   * Builds a single summary number.
   *
   * @param value - The number to show.
   * @param label - What the number counts.
   * @returns The card as HTML.
   */
  private renderCard(value: number, label: string): string {
    return `<div class="card"><span class="value">${value}</span><span class="label">${label}</span></div>`
  }

  /**
   * Builds the panel describing the visitor looking at the page.
   *
   * @param visitor - The current visitor, or undefined when the visit was made by a bot.
   * @returns The panel as HTML.
   */
  private renderCurrentVisitor(visitor?: Visitor): string {
    if (!visitor) {
      return `<section class="you">This visit was made by a bot, so it was not counted.</section>`
    }

    return `<section class="you">
      You are visitor <strong>#${visitor.uniqueId}</strong> —
      ${visitor.deviceType} on ${visitor.operatingSystem},
      from <code>${visitor.ipAddress ?? 'an unknown address'}</code>.
    </section>`
  }

  /**
   * Builds the table of every tracked visitor.
   *
   * @returns The table as HTML, or a message when no one has visited yet.
   */
  private renderVisitorTable(): string {
    const visitors = this.allVisitors()
    if (visitors.length === 0) {
      return '<p>No visitors yet.</p>'
    }

    const rows = visitors
      .map(
        (visitor) => `<tr>
          <td>#${visitor.uniqueId}</td>
          <td>${visitor.deviceType}</td>
          <td>${visitor.operatingSystem}</td>
          <td><code>${visitor.ipAddress ?? '—'}</code></td>
        </tr>`
      )
      .join('')

    return `<table>
      <thead><tr><th>Id</th><th>Device</th><th>System</th><th>Address</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`
  }

  /**
   * Gets the tracked visitors as a list.
   *
   * @returns Every visitor tracked so far.
   */
  private allVisitors(): Visitor[] {
    return [...this.tracker.getVisitors().values()]
  }
}
