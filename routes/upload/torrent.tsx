/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import { Comment, RenderReplies } from "../../components/Comment.tsx";
import Header from "../../islands/Header.tsx";
import UploadTorrent from "../../islands/UploadTorrent.tsx";

import { tw } from "@twind";

export default function Torrent(props: PageProps) {
  return (
    <div>
      <Header />
      <div class={tw`p-4 mx-auto max-w-screen-md text-center`}>
        <h1 class={tw`p-4 text-4xl font-bold`}>Upload a Torrent</h1>
        <UploadTorrent />
      </div>
    </div>
  );
}
