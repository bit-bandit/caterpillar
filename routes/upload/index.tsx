/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { caterpillarSettings } from "../../settings.ts";
import SearchBar from "../../islands/SearchBar.tsx";
import Header from "../../islands/Header.tsx";

export default function UploadMain(props: any) {
  return (
  <div>
        <Header />
<div class={tw`mx-auto max-w-screen-sm`}>
  <h1 class={tw`text-4xl text-center mt-9`}>Upload a...</h1>

  <a href="/upload/torrent">
    <div
      class={tw`max-h-18 m-4 flex max-w-screen-md items-center rounded-2xl p-4 shadow-md bg-white hover:bg-gray-100 hover:underline`}
    >
      <div class={tw`h-16 w-16 rounded-full bg-gray-200 p-3`}>
        <img class={tw`w-24`} src="/magnet.svg" />
      </div>
      <div>
        <div class={tw`mx-4 my-2 text-4xl font-bold`}>Torrent</div>
      </div>
    </div>
  </a>

  <a href="/upload/list">
    <div
      class={tw`max-h-18 m-4 flex max-w-screen-md items-center rounded-2xl p-4 shadow-md bg-white hover:bg-gray-100 hover:underline`}
    >
      <div class={tw`h-16 w-16 rounded-full bg-gray-200 p-3`}>
        <img class={tw`w-24`} src="/list.svg" />
      </div>
      <div>
        <div class={tw`mx-4 my-2 text-4xl font-bold`}>List</div>
      </div>
    </div>
  </a>
</div>
</div>
);
}