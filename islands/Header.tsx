/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

import { SmallSearchBar } from "./SearchBar.tsx";

export default function Header() {
  return (
    <div class={tw`bg-white p-1 shadow-md mb-7`}>
      <div class={tw`my-4 flex justify-center`}>
        <SmallSearchBar />
      </div>
    </div>
  );
}
