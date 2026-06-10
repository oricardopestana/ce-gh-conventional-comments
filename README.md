# GitHub Conventional Comments

[Conventional Comments](https://conventionalcomments.org/) labels at your fingertips in GitHub PR reviews.

Adds a toolbar button to every GitHub PR review comment textarea — click it to pick a conventional comment label (praise, suggestion, nitpick, etc.) and optional decoration, and the prefix is automatically inserted at your cursor.

## Usage

1. Open any pull request on GitHub (`github.com/*/*/pull/*`)
2. Click inside a comment textarea (review comment, file comment, or inline line comment)
3. Click the <img src="comment.svg" width="14" height="14" alt="" valign="middle" style="vertical-align: middle;"> button in the formatting toolbar
4. Pick a label from the menu:
   - **praise** — Highlight something positive
   - **nitpick** — Trivial preference-based request
   - **suggestion** — Propose an improvement
   - **issue** — Highlight a specific problem
   - **todo** — Small necessary change
   - **question** — Potential concern, not sure
   - **thought** — An idea that popped up
   - **chore** — Simple task that must be done
   - **note** — Something to take note of
5. Optionally choose a decoration (non-blocking, blocking, if-minor) from the sub-menu
6. The prefix (e.g. `suggestion (blocking): `) is inserted — finish typing your comment

## How it works

The extension injects a button into GitHub's existing "Formatting tools" toolbar inside the markdown editor. It uses native GitHub button styling and a menu that matches GitHub's ActionList look and feel.

- **No right-click override** — the native context menu is never touched
- **Works on all comment types** — review comments, file-level comments, and inline line comments
- **Keyboard friendly** — press `Escape` to close the menu
- **Click-outside to close** — click anywhere outside the menu to dismiss it

## Installation

### From source (developer mode)

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked** and select the extension directory
5. Navigate to any GitHub pull request page to test

## Files

| File | Description |
|---|---|
| `manifest.json` | Extension manifest (Chrome Extension Manifest V3) |
| `scripts/conventional-comments.js` | Main content script — toolbar injection and menu logic |
| `comment.svg` | Toolbar button icon (comment bubble with smiley) |
| `images/` | Extension icons |
| `hello.html` / `popup.js` | Extension popup (unused, placeholder) |

## Conventional Comments reference

For more details on the Conventional Comments format, visit [conventionalcomments.org](https://conventionalcomments.org/).

## License

MIT
