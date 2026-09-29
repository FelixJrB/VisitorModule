# visitor-module

Tracks unique visitors to a website. Every visitor gets an id, and the device
type and operating system are read from the browser's user agent string. 
No dependencies — only Node's standard library.

## What it does

- Recognises returning visitors, so the same browser from the same IP address keeps its id

- Assigns a new id to every visitor it has not seen before

- Counts unique visitors

- Reads the operating system (Windows, macOS, iOS, Android, Linux) from the user agent

- Reads the device type (desktop, mobile, tablet, TV) from the user agent

## What it does not do

- It does not store anything permanently — visitors are kept in memory and lost when the process restarts

- It does not look up country or city from the IP address

- It does not detect the browser (Chrome, Firefox, Safari)

- It does not use cookies, and it does not track visitors across different sites

## Requirements

Node.js 24.12.0 or later.

## Installation

```bash
npm install visitor-module
```

To run the tests or the test app, clone the repository instead:

```bash
git clone https://github.com/FelixJrB/VisitorModule.git
cd VisitorModule
npm install
```

## Usage

```ts
import { VisitorTracker } from 'visitor-module'

const tracker = new VisitorTracker()

const visitor = tracker.track({
  ipAddress: '83.250.10.4',
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
})

console.log(visitor.uniqueId) // 1
console.log(visitor.operatingSystem) // 'Windows'
console.log(visitor.deviceType) // 'Desktop'
```

Tracking the same visitor again returns the same visitor, with the same id:

```ts
tracker.track({ ipAddress: '83.250.10.4', userAgent: '...' })
console.log(tracker.getVisitorCount()) // 1
```

### In a Node server

```ts
import { createServer } from 'node:http'
import { VisitorTracker } from 'visitor-module'

const tracker = new VisitorTracker()

createServer((request, response) => {
  tracker.track({
    ipAddress: request.socket.remoteAddress,
    userAgent: request.headers['user-agent'] ?? '',
  })

  response.end(`Visitors: ${tracker.getVisitorCount()}`)
}).listen(3001)
```

## API

### `VisitorTracker`

| Method | Description | Returns |
| --- | --- | --- |
| `track(request)` | Tracks a visit. `request` is `{ ipAddress?, userAgent }`. Returns the existing visitor if this one has been seen before. | `Visitor` |
| `getVisitors()` | All tracked visitors. | `Map<string, Visitor>` |
| `getVisitorCount()` | Number of unique visitors. | `number` |
| `getUniqueId()` | The id assigned to the most recent new visitor. | `number` |

### `UserAgentParser`

| Method | Description | Returns |
| --- | --- | --- |
| `parseDeviceType(userAgent)` | Reads the device type from a user agent string. | `DeviceType` |
| `parseOperatingSystem(userAgent)` | Reads the operating system from a user agent string. | `OperatingSystem` |

### `Visitor`

| Property | Type |
| --- | --- |
| `uniqueId` | `number` |
| `ipAddress` | `string \| undefined` |
| `location` | `string` |
| `deviceType` | `DeviceType` |
| `operatingSystem` | `OperatingSystem` |

### Types

```ts
type DeviceType = 'Desktop' | 'Mobile' | 'Tablet' | 'Tv' | 'Unknown'
type OperatingSystem = 'Windows' | 'MacOs' | 'IOS' | 'Android' | 'Linux' | 'Unknown'
```

## Limitations

- User agent strings cannot be fully trusted. Browsers imitate each other and there is no standard, only historical conventions. The results are approximate, and `Unknown` is used when nothing matches.
- `location` is always `Unknown`. An IP address contains no location data in itself, so resolving it would require either an external API or a local GeoIP database. Both were out of scope for this module.
- A modern iPad in desktop mode reports `Macintosh` and neither `iPad` nor `Mobile`, so it cannot be told apart from a Mac.
- Visitors are identified by IP address and user agent, so two people on the same network using the same browser count as one visitor.
- Everything is kept in memory, so all data is lost when the process restarts.

## Development

```bash
npm test          # run the tests in watch mode
npm run test:run  # run the tests once
npm run typecheck # check types without emitting files
npm run lint      # check code style
npm run format    # reformat the source files
npm run build     # compile src/ to dist/
npm start         # run the test app on http://localhost:3001
```

The test app in `test-app/` is not part of the module. It is a small Node server
used to verify that the module works with real visits. See
[TEST_REPORT.md](TEST_REPORT.md) for what has been tested and the results.

## Project structure

```text
├── src/                     # the module
│   ├── index.ts             # public entry point
│   ├── Visitor.ts           # one visitor
│   ├── VisitorTracker.ts    # keeps track of all visitors
│   └── UserAgentParser.ts   # reads device type and operating system
├── test-app/               
│   └── app.ts               # small server used to test the module
├── dist/                    # compiled output (git-ignored)
├── tsconfig.json            # TypeScript config used by the editor and typecheck
├── tsconfig.build.json      # build-only config, emits dist/ from src/
└── TEST_REPORT.md           # what has been tested, how, and the result
```

## License

MIT — see [LICENSE](LICENSE).
