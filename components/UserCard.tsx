import { IS_BROWSER } from "$fresh/runtime.ts";
// For the header
export function SmallUserCard(props: {
  obj: unknown;
}) {
  return (
    <div class="items-center">
      <div class="relative">
        <details>
          <summary
            class="flex m-1 list-none items-center rounded-md text-center hover:bg-gray-200 p-1"
            title="See user info"
          >
            <img
              src={props.obj.icon.url}
              class="w-8 rounded-full shadow-md"
              alt={`Avatar for ${props.obj.name}`}
            />
          </summary>
          <div class="absolute  w-30 bg-white py-3 text-center shadow-lg">
            <a href={new URL(props.obj.id).pathname}>
              <div class="font-bold text flex items-center px-4 py-1 hover:bg-gray-200">
                {props.obj.name}
              </div>
            </a>
            <a href={new URL(props.obj.inbox).pathname}>
              <div class="text flex items-center px-4 py-1 hover:bg-gray-200">
                Inbox
              </div>
            </a>
            <a href={new URL(props.obj.following).pathname}>
              <div class="text flex items-center px-4 py-1 hover:bg-gray-200">
                Following
              </div>
            </a>
            <a href={new URL(props.obj.liked).pathname}>
              <div class="text flex items-center px-4 py-1 hover:bg-gray-200">
                Likes
              </div>
            </a>
            <a href="/logout">
              <div class="text flex items-center px-4 py-1 hover:bg-gray-200">
                Logout
              </div>
            </a>
          </div>
        </details>
      </div>
    </div>
  );
}

// For the `following`/`followers` page
export function UserCard(props: {
  followers: number;
  id: string;
  icon: string;
  href: string;
  name: string;
}) {
  let followStr = "Followers";

  if (props.followers === 1) {
    followStr = "Follower";
  }

  const formatedFollowers = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(props.followers);

  const u = new URL(props.id);
  const formattedUsername = `@${u.pathname.split("/")[2]}@${u.host}`;

  return (
    <div class="max-w-screen-md max-h-26 m-4 flex rounded-2xl p-4 shadow-md bg-white items-center justify-between">
      <div class="flex">
        <div>
          <img class="rounded-full shadow-md w-24" src={props.icon} />
        </div>
        <div class="m-6 hover:underline">
          <a href={props.href}>
            <h3 class="text-2xl font-bold">{props.name}</h3>
            <p class="text-gray-500">{formattedUsername}</p>
          </a>
        </div>
      </div>
      <div class="text-right">
        <h4 class="text-xl font-bold">{formatedFollowers}</h4>
        <p class="text-xs">{followStr}</p>
      </div>
    </div>
  );
}
