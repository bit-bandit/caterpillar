/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import { Comment, RenderReplies } from "../../components/Comment.tsx";
import Header from "../../islands/Header.tsx";
import UploadList from "../../islands/UploadList.tsx";

import { tw } from "@twind";

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

export default function Torrent(props: PageProps) {
  return (
    <>
      <Head>
        <title>Upload a list | {props.data.name}</title>
      </Head>
      <div>
        <Header />
        <div class={tw`p-4 mx-auto max-w-screen-md text-center`}>
          <h1 class={tw`p-4 text-4xl font-bold`}>Create a list</h1>
          <UploadList />
        </div>
      </div>
    </>
  );
}
