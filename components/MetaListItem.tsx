import { PageProps } from "$fresh/server.ts";
import { Subcomp } from "./Subcomponent.tsx";

export function ListItemList(props: {
  date: string;
  href: string;
  name: string;
  icon: string;
  uploaderHref: string;
  uploader: string;
  likes: string;
  dislikes: string;
  subitems: unknown[];
}) {
  const d = new Date(props.date);
  const u = new URL(props.uploaderHref);
  const formattedUsername = `@${u.pathname.split("/")[2]}@${u.host}`;

  return (
    <div class="max-w-screen-md max-h-26 m-4 flex rounded-2xl p-4 shadow-md bg-white">
      <div class="w-24 h-24 p-5 rounded-full bg-gray-200">
        <img class="w-24 h-14" src="/list.svg" />
      </div>
      <div>
        <div class="mx-4 my-2 text-3xl font-bold hover:underline break-all max-w-2xl">
          <a href={props.href}>{props.name}</a>
        </div>
        <div class="flex">
          <div class="w-6 ml-3">
            <img class="rounded-full shadow-md" src={props.icon} />
          </div>
          <a href={props.uploaderHref}>
            <div class="flex">
              <div class="pl-2 font-bold">{props.uploader}</div>
              <p class="text-xs place-self-center px-1 text-gray-600">
                {formattedUsername}
              </p>
            </div>
          </a>
          <p class="mx-2">-</p>
          <div class="text-slate-500">{d.toLocaleDateString()}</div>
          <p class="mx-2">-</p>
          <div class="flex">
            <div class="text-green-700">+{props.likes}</div>
            <div>/</div>
            <div class="text-red-700">-{props.dislikes}</div>
          </div>
	  <br/>
        </div>
        <div class="my-2">
          <details class="min-w-fit">
            <summary>Items ({props.subitems.length})</summary>
            {props.subitems.map((x) => {
              return (
                <Subcomp
                  APIObject={x}
                />
              );
            })}
          </details>
        </div>
      </div>
    </div>
  );
}
