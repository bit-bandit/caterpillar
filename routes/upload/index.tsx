import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import Header from "../../islands/Header.tsx";

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

export default function UploadMain(props: PageProps) {
  return (
    <>
      <Head>
        <title>Upload | {props.data.name}</title>
      </Head>
      <div>
        <Header />
        <div class="mx-auto max-w-screen-sm">
          <h1 class="text-4xl text-center mt-9">Upload a...</h1>

          <a href="/upload/torrent">
            <div class="max-h-18 m-4 flex max-w-screen-md items-center rounded-2xl p-4 shadow-md bg-white hover:bg-gray-100 hover:underline">
              <div class="h-16 w-16 rounded-full bg-gray-200 p-3">
                <img class="w-24" src="/magnet.svg" />
              </div>
              <div>
                <div class="mx-4 my-2 text-4xl font-bold">Torrent</div>
              </div>
            </div>
          </a>

          <a href="/upload/list">
            <div class="max-h-18 m-4 flex max-w-screen-md items-center rounded-2xl p-4 shadow-md bg-white hover:bg-gray-100 hover:underline">
              <div class="h-16 w-16 rounded-full bg-gray-200 p-3">
                <img class="w-24" src="/list.svg" />
              </div>
              <div>
                <div class="mx-4 my-2 text-4xl font-bold">List</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
