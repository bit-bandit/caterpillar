import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import { Comment, RenderReplies } from "../../components/Comment.tsx";
import Header from "../../islands/Header.tsx";
import UploadTorrent from "../../islands/UploadTorrent.tsx";

export default function Torrent(props: PageProps) {
  return (
    <>
      <Head>
        <title>Upload a torrent | {props.data.name}</title>
      </Head>
      <div>
        <Header />
        <div class="p-4 mx-auto max-w-screen-md text-center">
          <h1 class="p-4 text-4xl font-bold">Upload a Torrent</h1>
          <UploadTorrent />
        </div>
      </div>
    </>
  );
}
