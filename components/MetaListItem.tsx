/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { tw } from "@twind";

export function ListItemList(props: any) {
  let d = new Date(props.date);
  return (
    <div class={tw`max-h-26 m-4 flex rounded-3xl p-4 shadow-md`}>
      <div
        class={tw`max-h-16 rounded-full bg-slate-200 p-4 text-4xl`}
      >
      📋
      </div>
      <div>
        <div class={tw`mx-4 my-2 text-3xl font-bold`}>{props.name}</div>
        <div class={tw`flex`}>
          <div class={tw`w-6 mx-3`}>
            <img class={tw`rounded-full shadow-md`} src={props.icon} />
          </div>
          <div class={tw`font-bold`}>{props.uploader}</div>
          <p class={tw`mx-2`}>-</p>
          <div class={tw`italic text-slate-500"`}>{d.toLocaleString()}</div>
          <p class={tw`mx-2`}>-</p>
          <div class={tw`hover:underline`}>
            <a href={props.href}>Download</a>
          </div>
          <p class={tw`mx-2`}>-</p>
          <div class={tw`flex`}>
            <div class={tw`text-green-700`}>+23</div>
            <div>/</div>
            <div class={tw`text-red-700`}>-23</div>
          </div>
        </div>
      </div>
    </div>
  );
}
