# Content

<!-- nav -->

<sub><a href="../README.md">Project README</a> · <a href="README.md">Documentation index</a></sub>

> How to change what the maintenance page says and how it looks. Part of the [project documentation](README.md).

The whole page is the `PAGE` template string at the bottom of [`src/index.js`](../src/index.js). It is plain HTML and CSS with no external files, so it renders even when every other system is down.

| To change                   | Edit                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| Headline and message        | The `<h1>` and the `<p>` below it                                                             |
| Tab title                   | `<title>`                                                                                     |
| Colours                     | The custom properties on `:root` (`--bg1`, `--bg2`, `--bg3`, `--accent`, `--text`, `--muted`) |
| Logo mark and name          | The `.logo` block                                                                             |
| Favicon                     | The inline SVG data URI in `<link rel="icon">`                                                |
| "Go to teamsudda.lk" button | The `href` of the `.ghost` button                                                             |
| API message                 | The JSON body in `maintenance()`                                                              |

## Rules

- Keep everything inline. Do not add web fonts, images or scripts from other hosts; if they are down, the page breaks with them.
- Keep contrast at WCAG AA or better against the background colours.
- Check the page at phone width as well as desktop: run `bun run dev` and open http://localhost:8787.
- The tests assert the heading text. Update `test/index.test.mjs` if you change it.
