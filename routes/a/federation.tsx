/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import AdminFederation from "../../islands/AdminFederation.tsx";
import Header from "../../islands/Header.tsx";

// <AdminMain />
// <Header />
export default function Index(props: PageProps) {
  return (
    <div>
      <div class={tw`mx-auto max-w-screen-xl`}>
        <AdminFederation />
      </div>
    </div>
  );
}
