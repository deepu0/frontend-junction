# Frontend Junction - Content Capture Extension

Chrome extension to quickly capture frontend interview experiences from any blog.

## Install

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select this `chrome-extension/` folder

## Setup

Before using, set your capture key in browser console on any page:

```js
localStorage.setItem('fj_capture_key', 'your-capture-secret-here');
```

This must match the `CAPTURE_SECRET` env var on your backend.

## Usage

1. Browse to any blog with a frontend interview experience
2. Click the extension icon
3. URL and title auto-fill, page text auto-extracts into textarea
4. Edit/clean the text if needed, or paste your own
5. Click **Capture & Send**
6. Item goes to `queued` status → processed by AI pipeline

## How It Works

```
Extension → POST /api/pipeline/ingest → captured_content table (status: queued)
                                                    ↓
                                        AI pipeline (cron or manual trigger)
                                                    ↓
                                        score 8+ → published
                                        score 7  → review (admin approves)
                                        score <7 → rejected
```

## Configuration

Edit `popup.js` to change API URLs:

- First URL = production
- Second URL = local dev (fallback)

## Contributing

This is part of the [Frontend Junction](https://github.com/deepu0/frontend-junction) open source project.
