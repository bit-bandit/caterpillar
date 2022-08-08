/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

export function UserCard(props: any) {
  let formatedFollowers = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(props.followers);
  return (
    <div
      class={tw`p-5 m-4 shadow-md flex items-center max-w-sm rounded-3xl bg-white`}
    >
      <div>
        <img class={tw`rounded-full shadow-md w-24`} src={props.icon} />
      </div>
      <div class={tw`m-6 hover:underline`}>
        <a href={props.href}>
          <h3 class={tw`text-2xl font-bold`}>{}</h3>
          <p class={tw`text-gray-500`}>r@google.com</p>
        </a>
      </div>
      <div class={tw`text-right`}>
        <h4 class={tw`text-xl font-bold`}>{formatedFollowers}</h4>
        <p class={tw`text-xs`}>Followers</p>
      </div>
    </div>
  );
}
