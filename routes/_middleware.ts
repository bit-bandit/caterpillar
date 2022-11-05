import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { caterpillarSettings } from "../settings.ts";

// This is basically a big hack to do what sites like Mastodon
// and Pleroma do: If the right headers are provided, we'll
// forward to request over to the API server, and return the
// response from that.

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  // Deal with images
  if (req.url.endsWith(".png") || req.url.endsWith(".jpg")) {
    const u = new URL((new URL(req.url)).pathname, caterpillarSettings.apiURL);
    const res = await fetch(u.href);
    return res;
  }

  // Headers we'll allow.
  const validHeaders = [
    "application/ld+json",
    'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
    "application/json",
    "application/activity+json",
  ];

  if (validHeaders.includes(req.headers.get("accept"))) {
    const u = new URL((new URL(req.url)).pathname, caterpillarSettings.apiURL);

    const params = {
      method: req.method,
      headers: req.headers,
    };

    if (req.method !== "GET") {
      params.body = await req.text();
    }

    const res = await fetch(u.href, params);

    return res;
  }

  const resp = await ctx.next();
    
  return resp;
}
