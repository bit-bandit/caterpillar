import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../settings.ts";
import LoginForm from "../islands/Login.tsx";

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
        <title>Login | {props.data.name}</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <div class="my-6 text-center">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
