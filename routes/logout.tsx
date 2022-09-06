/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../settings.ts";
import Logout from "../islands/Logout.tsx";

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

export default function Login(props: PageProps) {
  return (
    <>
      <Head>
        <title>Logout | {props.data.name}</title>
      </Head>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <div class={tw`my-6 text-center`}>
          <Logout />
        </div>
      </div>
    </>
  );
}
