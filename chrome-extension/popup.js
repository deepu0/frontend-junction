const API_URLS = [
  'https://www.frontend-junction.com/api/pipeline/ingest',
  'http://localhost:3000/api/pipeline/ingest',
];

// Set your capture key here or in extension options
const CAPTURE_KEY = localStorage.getItem('fj_capture_key') || 'fj-capture-2026';

async function postToAPI(body) {
  for (const url of API_URLS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-capture-key': CAPTURE_KEY },
        body: JSON.stringify(body),
      });
      return { res, data: await res.json() };
    } catch (e) {
      continue;
    }
  }
  throw new Error('All endpoints unreachable');
}

document.addEventListener('DOMContentLoaded', async () => {
  const urlEl = document.getElementById('url');
  const titleEl = document.getElementById('title');
  const contentEl = document.getElementById('content');
  const charCount = document.getElementById('char-count');
  const btn = document.getElementById('capture-btn');
  const status = document.getElementById('status');

  // Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  urlEl.value = tab.url || '';
  titleEl.value = tab.title || '';

  // Auto-extract page text
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractPageContent,
    });
    if (result?.result) {
      contentEl.value = result.result;
      charCount.textContent = `${result.result.length} chars`;
    }
  } catch (e) {
    contentEl.placeholder = 'Could not auto-extract. Paste content here...';
  }

  contentEl.addEventListener('input', () => {
    charCount.textContent = `${contentEl.value.length} chars`;
  });

  btn.addEventListener('click', async () => {
    const content = contentEl.value.trim();
    if (!content) { showStatus('Content is required', 'error'); return; }
    if (content.length < 200) { showStatus('Too short (min 200 chars)', 'error'); return; }

    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const { res, data } = await postToAPI({
        url: urlEl.value,
        title: titleEl.value,
        content: content.substring(0, 50000),
        source: 'extension',
        capturedAt: new Date().toISOString(),
      });
      if (res.ok) {
        showStatus('\u2705 Captured successfully!', 'success');
      } else {
        showStatus(`\u274c ${data.error || 'Failed'}`, 'error');
      }
    } catch (e) {
      showStatus(`\u274c Network error: ${e.message}`, 'error');
    }
    btn.disabled = false;
    btn.textContent = 'Capture & Send';
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = `status ${type}`;
  }
});

// This function runs in the page context
function extractPageContent() {
  const selectors = ['article', 'main', '[role="main"]', '.post-content', '.article-body', '.entry-content', '.prose', '.blog-post', '.story-content'];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.innerText.trim().length > 300) {
      return cleanText(el.innerText);
    }
  }
  return cleanText(document.body.innerText);

  function cleanText(text) {
    return text
      .replace(/^(Skip to|Navigate to|Menu|Search|Sign [Ii]n|Log [Ii]n|Subscribe|Newsletter).*$/gm, '')
      .replace(/^(Share|Tweet|Like|Comment|Follow|Clap).*$/gm, '')
      .replace(/^(Cookie|Accept|Privacy|Terms).*$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .substring(0, 50000);
  }
}
