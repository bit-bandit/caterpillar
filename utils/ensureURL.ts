import { caterpillarSettings } from "../settings.ts";

export function ensureURL(url: string, local: string) {
  url = new URL(url);
  local = new URL(local);
  if (url.hostname === local.hostname) {
    url.hostname = new URL(caterpillarSettings.apiURL).hostname;
  }
  return url.href;
}
