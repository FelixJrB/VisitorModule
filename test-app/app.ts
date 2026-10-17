import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { readFile } from 'node:fs/promises'
import { UserAgentParser, VisitorTracker } from '../src/index.js'
import { VisitorPage } from './VisitorPage.js'

const port = 3001

// Built once, when the app starts, and then handed to the parts that need them.
const tracker = new VisitorTracker()
const parser = new UserAgentParser()
const page = new VisitorPage(tracker)

// Stands in for what a real app would do here: send a notification, write to a database.
// The module does not know or care what happens, it only reports that someone is new.
tracker.onNewVisitor((visitor) => {
  console.log(
    `New visitor #${visitor.uniqueId}: ${visitor.deviceType} on ${visitor.operatingSystem} from ${visitor.ipAddress}`
  )
})

/**
 * Tracks the visit behind a request, unless it was made by a bot.
 *
 * The module reports that a user agent belongs to a bot, but leaves the decision to the
 * app. This app chooses not to count them, so that search engines and link previews do not
 * show up among the visitors.
 *
 * @param request - The request to track.
 * @returns The visitor, or undefined when the visit was made by a bot.
 */
function trackVisit(request: IncomingMessage) {
  const userAgent = request.headers['user-agent'] ?? ''

  if (parser.isBot(userAgent)) {
    return undefined
  }

  return tracker.track({
    ipAddress: request.socket.remoteAddress,
    userAgent,
  })
}

/**
 * Answers a request with the stylesheet.
 *
 * @param response - The response to write to.
 */
async function serveStylesheet(response: ServerResponse) {
  const stylesheet = await readFile(new URL('./css/style.css', import.meta.url), 'utf8')
  response.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' })
  response.end(stylesheet)
}

/**
 * Answers one request, either with the stylesheet or with the visitor page.
 *
 * @param request - The incoming request.
 * @param response - The response to write to.
 */
async function handleRequest(request: IncomingMessage, response: ServerResponse) {
  if (request.url === '/style.css') {
    await serveStylesheet(response)
    return
  }

  const visitor = trackVisit(request)

  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  response.end(page.render(visitor))
}

const server = createServer(handleRequest)

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})
