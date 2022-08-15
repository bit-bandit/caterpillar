/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { caterpillarSettings } from "../settings.ts";
import SearchBar from "../islands/SearchBar.tsx";

export const handler = {
  async GET(_, ctx) {
    let res = await fetch(caterpillarSettings.apiURL);
    res = await res.json();
    return ctx.render(res);
  },
};

// Just for formatting the stats in a clean way...

function fmtNum(i: number) {
  return (
    Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(i)
  );
}

export default function Index(props: any) {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <div class={tw`my-6 text-center`}>
        <h1 class={tw`text-4xl font-bold`}>{props.data.name}</h1>
      </div>
      <div class={tw`flex justify-center my-4`}>
        <SearchBar />
      </div>
      <div class={tw`grid grid-cols-3 divide-x-2 text-center max-w-xs m-auto`}>
        <div class={tw`my-4 text-center`}>
          <h3 class={tw`text-gray-500`}>Torrents:</h3>
          <h2 class={tw`font-bold text-xl`}>{fmtNum(props.data.torrents)}</h2>
        </div>
        <div class={tw`my-4 text-center`}>
          <h3 class={tw`text-gray-500`}>Users:</h3>
          <h2 class={tw`font-bold text-xl`}>{fmtNum(props.data.users)}</h2>
        </div>
        <div class={tw`my-4 text-center`}>
          <h3 class={tw`text-gray-500`}>Lists:</h3>
          <h2 class={tw`font-bold text-xl`}>{fmtNum(props.data.lists)}</h2>
        </div>
      </div>
    </div>
  );
}
