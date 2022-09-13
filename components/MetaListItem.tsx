import { PageProps } from "$fresh/server.ts";
import { Subcomp } from "./Subcomponent.tsx";

export function ListItemList(props: any) {
  let d = new Date(props.date);
  return (
    <div class="max-h-26 m-4 flex rounded-3xl p-4 shadow-md bg-white">
      <div class="w-24 h-24 p-5 rounded-full bg-gray-200">
        <img class="w-24" src="/list.svg" />
      </div>
      <div>
        <div class="mx-4 my-2 text-3xl font-bold hover:underline">
          <a href={props.href}>{props.name}</a>
        </div>
        <div class="flex">
          <div class="w-6 mx-3">
            <img class="rounded-full shadow-md" src={props.icon} />
          </div>
          <div class="font-bold hover:underline">
            <a href={props.uploaderHref}>{props.uploader}</a>
          </div>
          <p class="mx-2">-</p>
          <div class="italic text-slate-500">{d.toLocaleString()}</div>
          <p class="mx-2">-</p>
          <div class="flex">
            <div class="text-green-700">+{props.likes}</div>
            <div>/</div>
            <div class="text-red-700">-{props.dislikes}</div>
          </div>
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
