/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

import { SmallSearchBar } from "./SearchBar.tsx";
import { caterpillarSettings } from "../settings.ts";

export default function Header() {
  return (
    <div
      class={tw`bg-white px-5 shadow-md mb-7 justify-between items-center flex`}
    >
      <a href="/">
        <div>
          <h1>{caterpillarSettings.siteName}</h1>
        </div>
      </a>
      <div class={tw`my-4 flex justify-center`}>
        <SmallSearchBar />
      </div>
      <div>
        <a href="/login">
          <p>Login</p>
        </a>
      </div>
    </div>
  );
}
