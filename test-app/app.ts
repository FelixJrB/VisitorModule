import { createServer } from 'node:http'
import { VisitorTracker } from '../src/index.js'

const Port = 3001

const tracker = new VisitorTracker()

const server = createServer((request, response) => {
  tracker.track({
    ipAddress: request.socket.remoteAddress,
    userAgent: request.headers['user-agent'] ?? '',
  })

    const rows = [...tracker.getVisitors().values()].map(
    (visitor) =>
      `<li>#${visitor.uniqueId} ${visitor.operatingSystem} ${visitor.deviceType} ${visitor.ipAddress}</li>`
  )

  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  response.end(`<h1>Visitors: ${tracker.getVisitorCount()}</h1><ul>${[...rows].join('')}</ul>`)
})

server.listen(Port, () => {
  console.log(`Server running at http://localhost:${Port}/`)
})