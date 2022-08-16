/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

export function UserCard(props: any) {
  let followStr = "Followers";

  if (props.followers === 1) {
    followStr = "Follower";
  }

  let formatedFollowers = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(props.followers);

  const u = new URL(props.id);
  const formattedUsername = `${u.pathname.split("/")[2]}@${u.host}`;

  return (
    <div
      class={tw`p-5 m-4 shadow-md flex items-center max-w-lg rounded-2xl bg-white justify-between m-auto`}
    >
      <div class={tw`flex`}>
        <div>
          <img class={tw`rounded-full shadow-md w-24`} src={props.icon} />
        </div>
        <div class={tw`m-6 hover:underline`}>
          <a href={props.href}>
            <h3 class={tw`text-2xl font-bold`}>{props.name}</h3>
            <p class={tw`text-gray-500`}>{formattedUsername}</p>
          </a>
        </div>
      </div>
      <div class={tw`text-right`}>
        <h4 class={tw`text-xl font-bold`}>{formatedFollowers}</h4>
        <p class={tw`text-xs`}>{followStr}</p>
      </div>
    </div>
  );
}
