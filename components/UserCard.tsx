/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

// For the header
export function SmallUserCard(props: any) {
  return (
    <div class={tw`items-center`}>
      <div class={tw`relative`}>
        <details>
          <summary
            class={tw`flex m-1 list-none items-center rounded-md text-center hover:bg-gray-200 p-1`}
            title="See user info"
          >
            <img
              src={props.obj.icon[0]}
              class={tw`w-8 rounded-full shadow-md mr-2`}
            />
            {props.obj.name}
          </summary>
          <div class="absolute left-2 w-30 bg-white py-3 text-center shadow-lg">
            <a href={props.obj.id}>
              <div
                class={tw`text flex items-center px-4 py-1 hover:bg-gray-200`}
              >
                Profile
              </div>
            </a>
            <a href={props.obj.following}>
              <div class="text flex items-center px-4 py-1 hover:bg-gray-200">
                Following
              </div>
            </a>
            <a href={props.obj.liked}>
              <div class="text flex items-center px-4 py-1 hover:bg-gray-200">
                Likes
              </div>
            </a>
          </div>
        </details>
      </div>
    </div>
  );
}

// For the `following`/`followers` page
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
