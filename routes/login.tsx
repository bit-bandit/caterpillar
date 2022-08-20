/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../settings.ts";
import LoginForm from "../islands/Login.tsx";

export default function Login(props: PageProps) {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <div class={tw`my-6 text-center`}>
        <LoginForm />
      </div>
    </div>
  );
}
