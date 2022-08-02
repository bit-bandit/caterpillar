/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

export function Comment(props: any) {
  const d = new Date(props.date);

  return (
    <div
      class={tw`m-4 flex max-w-3xl items-center rounded-3xl py-6 px-5 shadow-lg`}
    >
      <div class={tw`w-24`}>
        <img class={tw`rounded-full shadow-md`} src={props.avatarURL} />
      </div>
      <div class={tw`flex-none`}>
        <div
          class={tw`max-w-3xl flex-wrap py-2 px-5 text-2xl font-medium font-light`}
          dangerouslySetInnerHTML={{ __html: props.commentBody }}
        />
        <div class={tw`flex px-4`}>
          <div class={tw`px-2 font-bold`}>{props.username}</div>
          <p>-</p>
          <div class={tw`px-2 italic text-slate-500`}>{d.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
