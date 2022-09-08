import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../../settings.ts";
import UpdateList from "../../../islands/UpdateList.tsx";
import Header from "../../../islands/Header.tsx";

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

// <Header />
export default function Index(props: PageProps) {
  return (
    <>
      <Head>
        <title>Update List | {props.data.name}</title>
      </Head>
      <div>
        <div class="p-5 mx-auto max-w-screen-md text-center">
          <UpdateList />
        </div>
      </div>
    </>
  );
}
