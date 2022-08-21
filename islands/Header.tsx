/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { SmallSearchBar } from "./SearchBar.tsx";
import { caterpillarSettings } from "../settings.ts";
import UserBox from "./UserBox.tsx";

export default function Header() {
  return (
    <div
      class={tw`bg-white px-5 shadow-md mb-7 justify-around items-center flex`}
    >
      <a href="/">
        <div class={tw`hover:underline font-bold`}>
          <h1>{caterpillarSettings.siteName}</h1>
        </div>
      </a>
      <div class={tw`my-4 flex justify-center`}>
        <SmallSearchBar />
      </div>
      <div class={tw`flex items-center`}>
        <div class={tw`relative`}>
          <details>
            <summary
              class={tw`list-none mr-4 text-3xl text-center font-bold hover:bg-gray-200 items-center w-9 rounded-full`}
              title="Upload"
            >
              +
            </summary>
            <div
              class={tw`absolute shadow-lg w-32 right-2.5 bg-white py-3 text-center`}
            >
              <a href="/upload/torrent">
                <div class={tw`flex items-center hover:bg-gray-200 px-4 text`}>
                  <img src="/magnet.svg" class={tw`w-8 p-2`} />
                  Torrent
                </div>
              </a>
              <a href="/upload/list">
                <div class={tw`flex items-center hover:bg-gray-200 px-4 text`}>
                  <img src="/list.svg" class={tw`w-8 p-2`} />
                  List
                </div>
              </a>
            </div>
          </details>
        </div>
        <UserBox />
      </div>
    </div>
  );
}
