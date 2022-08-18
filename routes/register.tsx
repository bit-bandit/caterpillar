/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { caterpillarSettings } from "../settings.ts";
import RegistrationForm from "../islands/Register.tsx";

export default function Register(props: any) {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <RegistrationForm />
    </div>
  );
}
