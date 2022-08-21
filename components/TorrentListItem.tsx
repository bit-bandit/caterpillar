/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { tw } from "@twind";

// TODO: Add types to this.
export function ListItemTorrent(props: any) {
  const d = new Date(props.date);
  return (
    <div
      class={tw`max-w-screen-md max-h-26 m-4 flex rounded-2xl p-4 shadow-md`}
    >
      <div class={tw`w-24 h-24 p-5 rounded-full bg-gray-200`}>
        <img class={tw`w-24`} src="/magnet.svg" />
      </div>
      <div>
        <div class={tw`mx-4 my-2 text-3xl font-bold hover:underline`}>
          <a href={props.href}>{props.name}</a>
        </div>
        <div class={tw`flex`}>
          <div class={tw`w-6 mx-3`}>
            <img class={tw`rounded-full shadow-md`} src={props.icon} />
          </div>
          <div class={tw`font-bold hover:underline`}>
            <a href={props.uploaderHref}>{props.uploader}</a>
          </div>
          <p class={tw`mx-2`}>-</p>
          <div class={tw`italic text-slate-500"`}>{d.toLocaleString()}</div>
          <p class={tw`mx-2`}>-</p>
          <div class={tw`hover:underline`}>
            <a href={props.magnet}>Download</a>
          </div>
          <p class={tw`mx-2`}>-</p>
          <div class={tw`flex`}>
            <div class={tw`text-green-700`}>+{props.likes}</div>
            <div>/</div>
            <div class={tw`text-red-700`}>-{props.dislikes}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
