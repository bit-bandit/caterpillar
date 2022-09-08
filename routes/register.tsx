import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../settings.ts";
import RegistrationForm from "../islands/Register.tsx";

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

export default function Register(props: PageProps) {
  return (
    <>
      <Head>
        <title>Register | {props.data.name}</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <RegistrationForm />
      </div>
    </>
  );
}
