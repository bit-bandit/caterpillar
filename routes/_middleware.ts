import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { caterpillarSettings } from "../settings.ts";

// This is basically a big hack to do what sites like Mastodon
// and Pleroma do: If the right headers are provided, we'll
// forward to request over to the API server, and return the
// response from that.
// This is mainly just for GET requests, at the moment.
// Hopefully POST will be taken care of, eventually...

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  // Headers we'll allow.
  const validHeaders = [
    "application/ld+json",
    'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
    "application/json",
    "application/activity+json",
  ];

  if (validHeaders.includes(req.headers.get("accept"))) {
    const u = new URL((new URL(req.url)).pathname, caterpillarSettings.apiURL);

    let res: Response;

    if (req.method === "GET") {
      res = await fetch(u.href);
    } else {
      return new Response(JSON.stringify({
        "err": true,
        "msg": "Method not allowed.",
      }));
    }
    return res;
  }

  const resp = await ctx.next();
  return resp;
}
