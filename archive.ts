#!/usr/bin/env bun

import ora from "ora";

interface ArchiveResult {
  originalUrl: string;
  archivedUrl?: string;
  error?: string;
}

async function archiveUrls(urls: string[]): Promise<ArchiveResult[]> {
  const results: ArchiveResult[] = [];
  const spinner = ora("Starting archiving process...").start();

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    spinner.text = `Archiving (${i + 1}/${urls.length}): ${url}`;

    try {
      const response = await fetch(
        `https://web.archive.org/save/${encodeURIComponent(url)}`,
        {
          headers: {
            "User-Agent":
              "BunArchiver/1.0 (+https://github.com/et0and/alexandria)",
          },
        }
      );

      if (response.status === 200) {
        const contentLocation = response.headers.get("content-location");
        if (contentLocation) {
          results.push({
            originalUrl: url,
            archivedUrl: `https://web.archive.org${contentLocation}`,
          });
          continue;
        }
      }

      results.push({
        originalUrl: url,
        error: `Failed to archive: ${response.status} ${response.statusText}`,
      });
    } catch (error) {
      results.push({
        originalUrl: url,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Add delay to be polite to the API (1 second between requests)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  spinner.succeed("Archiving process complete.");
  return results;
}

async function main() {
  // Read input file
  const inputFile = Bun.file("input.txt");
  const urls = (await inputFile.text())
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);

  if (urls.length === 0) {
    console.error("No URLs found in input.txt");
    return;
  }

  // Archive URLs
  const results = await archiveUrls(urls);

  // Write output CSV
  const csvContent = [
    "Original URL,Archived URL,Error",
    ...results.map(
      (r) => `"${r.originalUrl}","${r.archivedUrl || ""}","${r.error || ""}"`
    ),
  ].join("\n");

  await Bun.write("output.csv", csvContent);
}

main().catch(console.error);
