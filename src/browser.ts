import { BrowserName, CompatStatement } from "@mdn/browser-compat-data/types";

export const MODERN_BROWSERS_OTHER_THAN_SAFARI: BrowserName[] = [
  "chrome",
  "chrome_android",
  "edge",
  "firefox",
  "firefox_android",
  "webview_android",
];

export function isSupportedBy(
  compat: CompatStatement,
  browser: BrowserName
): boolean {
  const statement = compat.support[browser];
  if (!statement) return false;
  const [state] = Array.isArray(statement) ? statement : [statement];
  return state.version_added !== false && state.version_removed === undefined;
}

export function isSupportedByModernBrowsersOtherThanSafari(
  compat: CompatStatement
): boolean {
  return MODERN_BROWSERS_OTHER_THAN_SAFARI.every((browser) =>
    isSupportedBy(compat, browser)
  );
}
