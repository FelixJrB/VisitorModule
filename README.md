# visitor-module

Tracks unique visitors to a website. Every visitor gets an id, and the device type and
operating system are read from the browser's user agent string. No dependencies — only
Node's standard library.

Works with both JavaScript and TypeScript. TypeScript users get the types with the package.

## Requirements

Node.js 24.12.0 or later. No other dependencies.

## Quick start

**1. Install it.**

```bash
npm install visitor-module
```

**2. Make sure your project uses ES modules.** The package is ESM only, so your
`package.json` needs this line:

```json
{
  "type": "module"
}
```

Without it, `import` fails with `ERR_REQUIRE_ESM` or "Cannot use import statement outside a
module".

**3. Track a visit.**

```js
// app.js
import { VisitorTracker } from 'visitor-module'

const tracker = new VisitorTracker()

const visitor = tracker.track({
  ipAddress: '83.250.10.4',
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
})

console.log(visitor)
console.log('Unique visitors:', tracker.getVisitorCount())
```

**4. Run it.**

```bash
node app.js
```

```text
Visitor {
  uniqueId: 1,
  ipAddress: '83.250.10.4',
  location: 'Unknown',
  deviceType: 'Mobile',
  operatingSystem: 'IOS'
}
Unique visitors: 1
```

Track the same address and user agent again and you get the same visitor back, with the
same id. The count stays at 1.

## In a web server

Create the tracker once, when the server starts, and call `track()` for every request.

```js
import { createServer } from 'node:http'
import { VisitorTracker, UserAgentParser } from 'visitor-module'

const tracker = new VisitorTracker()
const parser = new UserAgentParser()

createServer((request, response) => {
  const userAgent = request.headers['user-agent'] ?? ''

  // Search engines and link previews request pages too. This app chooses not to count them.
  if (!parser.isBot(userAgent)) {
    tracker.track({ ipAddress: request.socket.remoteAddress, userAgent })
  }

  response.end(`Visitors: ${tracker.getVisitorCount()}`)
}).listen(3001)
```

Behind a proxy such as nginx, Cloudflare or Render, `request.socket.remoteAddress` is the
address of the proxy. Read the visitor's own address from the `x-forwarded-for` header
instead, or use `req.ip` with `app.set('trust proxy', true)` in Express.

## Get told when someone new arrives

Register a function and the tracker calls it the first time a visitor is seen. Returning
visitors do not trigger it, so you are not notified twice for the same person.

```js
tracker.onNewVisitor((visitor) => {
  console.log(`New visitor #${visitor.uniqueId} on ${visitor.deviceType}`)
  // or send it to Discord, ntfy, your database, anywhere
})
```

A listener that throws is ignored, so a failing notification never stops a visit from
being tracked.

## Add the place yourself

The module does not resolve addresses to places, because that needs a service or a
database it does not have. If you look the place up, pass it in and it is stored with the
visitor:

```js
const place = await fetch(`http://ip-api.com/json/${ipAddress}`).then((r) => r.json())

const visitor = tracker.track({
  ipAddress,
  userAgent,
  location: `${place.city}, ${place.country}`,
})

visitor.location // 'Växjö, Sweden'
```

Leave it out and `location` is `'Unknown'`.

## Show statistics

```js
const visitors = [...tracker.getVisitors().values()]

console.log({
  total: tracker.getVisitorCount(),
  mobile: visitors.filter((visitor) => visitor.deviceType === 'Mobile').length,
  windows: visitors.filter((visitor) => visitor.operatingSystem === 'Windows').length,
})
```

## What it does

- Recognises returning visitors, so the same browser from the same address keeps its id
- Gives every new visitor an id, and lets you look a visitor up by it
- Counts unique visitors
- Reads the operating system (Windows, macOS, iOS, Android, Linux) from the user agent
- Reads the device type (desktop, mobile, tablet, TV) from the user agent
- Recognises bots and crawlers, and leaves it to you to decide what to do with them
- Reduces the different notations of one address to one form, so a visitor is not counted
  twice

## What it does not do

- It does not store anything permanently — visitors are kept in memory and are lost when
  the process restarts
- It does not look up country or city from the address
- It does not detect the browser (Chrome, Firefox, Safari)
- It does not use cookies, and it does not track visitors across different sites
- It does not decide anything for you: bots are reported, not filtered out

## API

### `VisitorTracker`

| Method | Description | Returns |
| --- | --- | --- |
| `track(request)` | Tracks a visit. `request` is `{ ipAddress?, userAgent, location? }`. Returns the existing visitor when this one has been seen before. | `Visitor` |
| `onNewVisitor(listener)` | Registers a function to call whenever someone visits for the first time. Returning visitors do not trigger it. | `void` |
| `getVisitorCount()` | Number of unique visitors. | `number` |
| `getVisitorById(id)` | The visitor with that id. | `Visitor \| undefined` |
| `getVisitors()` | A copy of all visitors, keyed by the internal lookup key. Changing it does not affect the tracker. | `Map<string, Visitor>` |
| `getUniqueId()` | ⚠️ Deprecated since 0.2.0. Returns the most recently assigned id, not a visitor's own. Read `uniqueId` on the visitor from `track()`, or use `getVisitorById()`. | `number` |

### `UserAgentParser`

Can be used on its own, without a tracker, to read a user agent string.

| Method | Description | Returns |
| --- | --- | --- |
| `parseDeviceType(userAgent)` | Reads the device type. | `DeviceType` |
| `parseOperatingSystem(userAgent)` | Reads the operating system. | `OperatingSystem` |
| `isBot(userAgent)` | Whether the user agent identifies itself as a bot or crawler. | `boolean` |

### `Visitor`

A visitor is read-only. Every property is set when the visitor is created and never
changes.

| Property | Type |
| --- | --- |
| `uniqueId` | `number` |
| `ipAddress` | `string \| undefined` |
| `location` | `string` — what you passed in, or `'Unknown'` |
| `deviceType` | `DeviceType` |
| `operatingSystem` | `OperatingSystem` |

### Types

```ts
type DeviceType = 'Desktop' | 'Mobile' | 'Tablet' | 'Tv' | 'Unknown'
type OperatingSystem = 'Windows' | 'MacOs' | 'IOS' | 'Android' | 'Linux' | 'Unknown'
```

## Limitations

- User agent strings cannot be fully trusted. Browsers imitate each other and there is no
  standard, only historical conventions. The results are approximate, and `Unknown` is used
  when nothing matches.
- The module does not resolve places. An address contains no location in itself, so
  resolving one needs an external service or a local GeoIP database, neither of which
  belongs in a module with no dependencies. Look the place up yourself and pass it in, or
  leave `location` as `Unknown`.
- A modern iPad in desktop mode reports `Macintosh` and neither `iPad` nor `Mobile`, so it
  cannot be told apart from a Mac.
- Visitors are identified by address and user agent, so two people on the same network using
  the same browser count as one visitor.
- Bot detection relies on bots identifying themselves. A bot that pretends to be a browser
  is counted as a visitor.
- Everything is kept in memory, so all data is lost when the process restarts.

## Troubleshooting

**`ERR_REQUIRE_ESM`, or "Cannot use import statement outside a module"**
Add `"type": "module"` to your `package.json`. The package is ESM only.

**Every visitor has the address `::1` or `127.0.0.1`**
You are running locally, so every request comes from your own machine.

**Every visitor seems to come from the same address**
Your app is behind a proxy. Read `x-forwarded-for` instead of
`request.socket.remoteAddress`.

**The count does not go up when I reload**
That is the point — the same browser from the same address is the same visitor. Open the
page in another browser to see the count change.

## Development

Clone the repository to run the tests or the test app:

```bash
git clone https://github.com/FelixJrB/VisitorModule.git
cd VisitorModule
npm install
```

```bash
npm test          # run the tests in watch mode
npm run test:run  # run the tests once
npm run typecheck # check types without emitting files
npm run lint      # check code style
npm run format    # reformat the source files
npm run build     # compile src/ to dist/
npm start         # run the test app on http://localhost:3001
```

The test app in `test-app/` is not part of the module. It is a small Node server that uses
the module the way any other project would, and it is there to verify that the module works
with real visits. See [TEST_REPORT.md](TEST_REPORT.md) for what has been tested.

## Project structure

```text
├── src/                     # the module
│   ├── index.ts             # public entry point
│   ├── types.ts             # the shared types
│   ├── Visitor.ts           # one visitor
│   ├── VisitorTracker.ts    # keeps track of all visitors
│   ├── VisitorNotifier.ts   # tells listeners about new visitors
│   ├── VisitorKey.ts        # internal: identifies a visitor
│   └── UserAgentParser.ts   # reads device type, operating system and bots
├── test-app/                # not part of the module
│   ├── app.ts               # small server used to test the module manually
│   ├── VisitorPage.ts       # renders the page
│   └── css/style.css
├── dist/                    # compiled output (git-ignored)
└── TEST_REPORT.md           # what has been tested, how, and the result
```

## Contributing

Found a bug or have a suggestion? Open an issue on
[GitHub](https://github.com/FelixJrB/VisitorModule/issues).

## License

MIT — see [LICENSE](LICENSE).

Built as part of the course 1DV610 at Linnaeus University.
