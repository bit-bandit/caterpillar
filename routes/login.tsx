/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { caterpillarSettings } from "../settings.ts";

export default function Index(props: any) {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <div class={tw`my-6 text-center`}>
        <p>Login</p>
      </div>
    </div>
  );
}
