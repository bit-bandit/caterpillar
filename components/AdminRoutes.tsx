/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

export default function AdminRoutes() {
  return (
    <div>
      <div class={tw`my-2 mx-2`}>
        <a href="/a/federation">
          <div
            class={tw`m-2 rounded-md bg-white p-2 shadow-md hover:bg-gray-100`}
          >
            Federation
          </div>
        </a>
        <a href="/a/roles">
          <div
            class={tw`m-2 rounded-md bg-white p-2 shadow-md hover:bg-gray-100`}
          >
            Roles
          </div>
        </a>
        <a href="/a/delete">
          <div
            class={tw`m-2 rounded-md bg-white p-2 shadow-md hover:bg-gray-100`}
          >
            Delete
          </div>
        </a>
      </div>
    </div>
  );
}
