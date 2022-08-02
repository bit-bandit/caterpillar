/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import { tw } from "@twind";

// let res = await fetch(c.href);

export const handler = {
  async GET(_, ctx) {
    let res = {};
    const { id } = ctx.params;

    const torrentAPI = new URL(`/t/${id}`, caterpillarSettings.apiURL);

    let req = await fetch(torrentAPI.href);

    res.torrent = await req.json();
    req = await fetch(res.torrent.attributedTo);
    res.user = await req.json();
    return ctx.render(res);
  },
};

export default function Torrent(props: PageProps) {
  const submitter = props.data.user;
  console.log(submitter);
  const torrent = props.data.torrent;

  return (
    <div>
      <div class={tw`mx-auto max-w-screen-md`}>
        <div class={tw`text-5xl font-bold leading-tight text-center`}>
          <h1>{torrent.name}</h1>
        </div>
        <div class={tw`grid grid-cols-3 gap-12 content-center px-28 m-3`}>
          <div
            class={tw`px-6 py-3 rounded-full shadow-lg text-center flex gap-6 hover:bg-gray-100 hover:shadow-xl`}
          >
            <div class={tw`w-6 h-6 rounded-full`}>
              <img class={tw`rounded-full`} src={submitter.icon[0]} />
            </div>
            <div class={tw`font-bold`}>
              <a href={torrent.attributedTo}>{submitter.name}</a>
            </div>
          </div>
          <div
            class={tw`px-6 py-3 rounded-full shadow-lg text-center hover:bg-gray-100 hover:shadow-xl`}
          >
            <a href={torrent.attachment.href}>Magnet</a>
          </div>
          <div
            class={tw`px-6 py-3 rounded-full shadow-lg text-center hover:bg-gray-100 hover:shadow-xl`}
          >
            <a href="">Score</a>
          </div>
        </div>
        <div
          id="description"
          class={tw`p-6 shadow-lg rounded-full`}
          dangerouslySetInnerHTML={{ __html: torrent.content }}
        />
        <br />
        <div
          class={tw`text-4xl font-bold leading-tight snap-center text-center`}
        >
          <h1>Replies</h1>
        </div>
      </div>
    </div>
  );
}
