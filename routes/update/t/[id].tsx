import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../../settings.ts";
import UpdateTorrent from "../../../islands/UpdateTorrent.tsx";

export const handler: Handlers = {
  async GET(_, ctx) {
    let res = await fetch(caterpillarSettings.apiURL, {
      headers: {
        "Accept": "application/activity+json",
      },
    });
    res = await res.json();
    return ctx.render(res);
  },
};

export default function Index(props: PageProps) {
  return (
    <>
      <Head>
        <title>Update Torrent | {props.data.name}</title>
      </Head>
      <div>
        <div class="p-5 mx-auto max-w-screen-md text-center">
          <UpdateTorrent />
        </div>
      </div>
    </>
  );
}
