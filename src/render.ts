import type {
  CompatStatement,
  SupportStatement,
  VersionValue,
} from "@mdn/browser-compat-data/types";
import { readFileSync } from "fs";
import path from "path";
import { isSupportedBy, MODERN_BROWSERS_OTHER_THAN_SAFARI } from "./browser";

function getPackageVersion(packageName: string): string {
  const filePath = path.resolve("./node_modules", packageName, "package.json");
  const packageJson = readFileSync(filePath, { encoding: "ascii" });
  const { version } = JSON.parse(packageJson) as { version?: unknown };
  return typeof version === "string" ? version : "unknown";
}

const HEADER = `
# Safari a.k.a Next IE

## Description

- Some people think that "Safari is the new Internet Explorer".
  - Ref. [Safari is the new Internet Explorer](https://www.safari-is-the-new-ie.com/)

> All of the APIs I mentioned above are not implemented in Safari, and Apple has shown no public interest in them.

Ref. [Safari is the new IE | Read the Tea Leaves](https://nolanlawson.com/2015/06/30/safari-is-the-new-ie/)

## Features List

- Version of [@mdn/browser-compat-data](https://github.com/mdn/browser-compat-data): ${getPackageVersion(
  "@mdn/browser-compat-data"
)}
- Generated date: ${new Date().toUTCString()}

| Feature | Safari Support | ${MODERN_BROWSERS_OTHER_THAN_SAFARI.join(" | ")} |
| :------ | :------------: | ${" :-: |".repeat(
  MODERN_BROWSERS_OTHER_THAN_SAFARI.length
)}
`.trim();

export function renderHeader(): string {
  return HEADER;
}

function renderFeature(text: string, url?: string): string {
  return url !== undefined ? `[${text}](${url})` : text;
}

function renderSafariSupport(compat: CompatStatement): string {
  return (
    [
      isSupportedBy(compat, "safari") ? "💻" : null,
      isSupportedBy(compat, "safari_ios") ? "📱" : null,
    ]
      .filter(Boolean)
      .join(", ") || "None"
  );
}

function getVersionAdded(support: SupportStatement): VersionValue {
  const version = Array.isArray(support)
    ? support[0].version_added
    : support.version_added;
  return version !== true ? version : "Yes";
}

function renderSupport(support: SupportStatement | undefined): string {
  if (support === undefined) return "❌";
  const version = getVersionAdded(support);
  return version === null
    ? "❓"
    : version === true
    ? "Yes"
    : version === false
    ? "❌"
    : version;
}

export function renderFeatureTableRow(
  path: string,
  compat: CompatStatement
): string {
  return `| ${renderFeature(path, compat.mdn_url)} | ${renderSafariSupport(
    compat
  )} | ${MODERN_BROWSERS_OTHER_THAN_SAFARI.map((browser) =>
    renderSupport(compat.support[browser])
  ).join(" | ")} |`;
}
