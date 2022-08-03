/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

/* API:
<Comment
  username={actor.name}
  avatarURL={actor.icon[0]}
  date={object.published}
  commentBody={object.content}
  likes={likes.length}
  dislikes={dislikes.length}
/>

*/

export function Comment(props: any) {
  const d = new Date(props.date);

  return (
    <div
      class={tw`m-4 flex max-w-3xl items-center rounded-3xl py-4 px-5 shadow-lg`}
    >
      <div class={tw`w-16`}>
        <img class={tw`rounded-full shadow-md`} src={props.avatarURL} />
      </div>
      <div class={tw`flex-none`}>
        <div
          class={tw`max-w-4xl flex-wrap py-1 px-5 text-lg`}
          dangerouslySetInnerHTML={{ __html: props.commentBody }}
        />
        <div class={tw`flex px-4`}>
          <div class={tw`px-2 font-bold`}>{props.username}</div>
          <p>-</p>
          <div class={tw`px-2 italic text-slate-500`}>{d.toLocaleString()}</div>
          <p>-</p>
          <div class="mx-2 flex">
            <div class="text-green-700">+{props.likes}</div>
            <div>/</div>
            <div class="text-red-700">-{props.dislikes}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
