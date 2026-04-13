# log-analyzer

A browser-based log file analyzer — no server, no upload, just drop and inspect.

**Live app:** https://18135A1206.github.io/log-analyzer

---

## Features

- **No server required** — runs entirely in the browser, your logs never leave your machine
- **Drag & drop or click to upload** any `.log`, `.txt`, or plain text log file
- **Auto-parses** common log formats (ISO timestamps, bracketed levels, plain text)
- **Summary dashboard** — see total, error, warn, info, debug, and trace counts at a glance with a health score
- **Filter by log level** — toggle error, warn, info, debug, trace independently
- **Search** — filter entries by keyword across message and source
- **Annotate entries** — add notes to specific log lines
- **Scroll to top/bottom** buttons for large files
- **Supports log levels:** `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`

---

## Supported Log Formats

The parser handles these formats automatically:

```
# ISO timestamp with level
2025-07-07T12:14:24.476751Z INFO q2_sdk.general some message

# ISO timestamp with bracketed level
2025-07-07T12:14:24.476 [ERROR] Failed to connect to database

# Simple timestamp
07/07/2025 12:14:24 [WARN] Retrying request

# Level prefix only
ERROR: Something went wrong
INFO: Server started on port 3000

# Plain text (level detected from message content)
An exception occurred while processing the request
```

---

## Usage

1. Open the app at https://18135A1206.github.io/log-analyzer
2. **Upload a log file** — drag and drop onto the upload area, or click to browse
3. View the **summary panel** for an overview of log levels and health score
4. Use the **level filter buttons** to show/hide specific log levels
5. Use the **search bar** to find entries by keyword
6. Click any log entry to **add an annotation**
7. Use the **clear button** to reset and load a new file

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/18135A1206/log-analyzer.git
cd log-analyzer

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open http://localhost:5173 in your browser.

```bash
# Build for production
pnpm build
```

---

## Tech Stack

- [React 19](https://react.dev)
- [Vite 6](https://vitejs.dev)
- [TypeScript](https://typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Lucide React](https://lucide.dev) — icons
- [date-fns](https://date-fns.org) — timestamp formatting
- [react-hot-toast](https://react-hot-toast.com) — notifications
- Deployed via [GitHub Pages](https://pages.github.com)
