import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../settings.ts";
import { SearchBar } from "../components/SearchBar.tsx";
import RootHeader from "../islands/RootHeader.tsx";

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

// Just for formatting the stats in a clean way...

function fmtNum(i: number) {
  return (
    Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(i)
  );
}

export default function Index(props: PageProps) {
  return (
    <>
      <Head>
        <title>Home | {props.data.name}</title>
      </Head>
      <RootHeader />
      <div class="p-4 mx-auto max-w-screen-md">
        <div class="my-6 text-center">
          <h1 class="text-4xl font-bold">{props.data.name}</h1>
        </div>
        <div class="flex justify-center my-4">
          <SearchBar />
        </div>
        <div class="flex divide-x-2 text-center max-w-xs m-auto justify-center">
          <div class="my-4 text-center px-6">
            <h3 class="text-gray-500">Torrents:</h3>
            <h2 class="font-bold text-xl">{fmtNum(props.data.torrents)}</h2>
          </div>
          <div class="my-4 text-center px-6">
            <h3 class="text-gray-500">Users:</h3>
            <h2 class="font-bold text-xl">{fmtNum(props.data.users)}</h2>
          </div>
          <div class="my-4 text-center px-6">
            <h3 class="text-gray-500">Lists:</h3>
            <h2 class="font-bold text-xl">{fmtNum(props.data.lists)}</h2>
          </div>
        </div>
      </div>
    </>
  );
}
