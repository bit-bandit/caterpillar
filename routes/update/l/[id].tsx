/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../../settings.ts";
import UpdateList from "../../../islands/UpdateList.tsx";
import Header from "../../../islands/Header.tsx";

// <Header />
export default function Index(props: PageProps) {
  return (
    <div>
      <div class={tw`p-5 mx-auto max-w-screen-md text-center`}>
        <UpdateList />
      </div>
    </div>
  );
}
