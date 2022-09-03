/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import AdminMain from "../../islands/AdminMain.tsx";
import Header from "../../islands/Header.tsx";

// <AdminMain />
// <Header />
export default function Index(props: PageProps) {
  return (
    <div>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <AdminMain />
        <a href="/" class={tw`hover:underline text-blue-800 mx-5`}>🡐 Back</a>
      </div>
    </div>
  );
}
