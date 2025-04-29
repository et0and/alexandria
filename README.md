# alexandria

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run archive.ts
```

This script reads a list of urls from an input.txt file, archives this to the Wayback Machine, and then generates a CSV of the original urls, archived urls and any errors after the job is complete.

If you want an easy way to generate a list of urls for a website that doesn't offer a sitemap, I recommend using [sikemap](https://www.npmjs.com/package/sikemap).

This project was created using `bun init` in bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
