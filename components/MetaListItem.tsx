/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { tw } from "@twind";

export function ListItemList(props: any) {
  let d = new Date(props.date);
  return (
    <div class={tw`max-h-26 m-4 flex rounded-3xl p-4 shadow-md`}>
      <div class={tw`w-24 p-5 rounded-full bg-slate-300`}>
        <img class={tw`w-24`} src="/list.svg" />
      </div>
      <div>
        <div class={tw`mx-4 my-2 text-3xl font-bold hover:underline`}>
          <a href={props.href}>{props.name}</a>
        </div>
        <div class={tw`flex`}>
          <div class={tw`w-6 mx-3`}>
            <img class={tw`rounded-full shadow-md`} src={props.icon} />
          </div>
          <div class={tw`font-bold hover:underline`}><a href={props.uploaderHref}>{props.uploader}</a></div>
          <p class={tw`mx-2`}>-</p>
          <div class={tw`italic text-slate-500"`}>{d.toLocaleString()}</div>
          <p class={tw`mx-2`}>-</p>
          <div class={tw`flex`}>
            <div class={tw`text-green-700`}>+{props.likes}</div>
            <div>/</div>
            <div class={tw`text-red-700`}>-{props.dislikes}</div>
          </div>
        </div>
        <div class={tw`my-2`}>
          <details class={tw`min-w-fit`}>
            <summary>Items ({props.subitems.length})</summary>
            {props.subitems.map((x) => {
              return (
                <div
                  class={tw`max-h-26 m-3 flex rounded-2xl bg-slate-200 p-3 shadow-md`}
                >
                  <img class={tw`w-7`} src="/magnet.svg" />
                  <h4 class={tw`mx-3 text-xl font-bold hover:underline`}>
                    <a href={x.url}>{x.name}</a>
                  </h4>
                  <div class={tw`mx-1 flex`}>
                    <div class={tw`text-green-700`}>+{x.likes}</div>
                    <div>/</div>
                    <div class={tw`text-red-700`}>-{x.dislikes}</div>
                  </div>
                </div>
              );
            })}
          </details>
        </div>
      </div>
    </div>
  );
}
