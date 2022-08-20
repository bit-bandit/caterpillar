/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../settings.ts";
import RegistrationForm from "../islands/Register.tsx";

export default function Register(props: PageProps) {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <RegistrationForm />
    </div>
  );
}
