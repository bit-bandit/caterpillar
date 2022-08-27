/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import CommentBox from "../islands/CommentBox.tsx";
import Likes from "../islands/Likes.tsx";
import Dislikes from "../islands/Dislikes.tsx";
import Undo from "../islands/Undo.tsx";
import * as ammonia from "https://deno.land/x/ammonia@0.3.1/mod.ts";

await ammonia.init();

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
      class={tw`m-4 flex max-w-3xl items-center rounded-2xl py-4 px-5 shadow-md`}
    >
      <div class={tw`w-16`}>
        <img class={tw`rounded-full shadow-md`} src={props.avatarURL} />
      </div>
      <div class={tw`flex-none`}>
        <div
          class={tw`max-w-4xl flex-wrap py-1 px-5 text-base`}
          dangerouslySetInnerHTML={{ __html: ammonia.clean(props.commentBody) }}
        />
        <div class={tw`flex px-3 text-sm`}>
          <div class={tw`px-2 font-bold`}>{props.username}</div>
          <p>-</p>
          <div class={tw`px-2 italic text-slate-500`}>{d.toLocaleString()}</div>
          <p>-</p>
          <div class={tw`mx-2 flex items-center`}>
            <Likes total={props.likes} href={props.id}/>
            <div>/</div>
            <Dislikes total={props.dislikes} href={props.id}/>
	    <p class={tw`mx-1`} />
	    <Undo href={props.id}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// Requires an array of objects that share the same syntax as Comment
export function RenderReplies(props: any) {
  return (
    <div class={tw`px-9 mx-7`}>
      <details>
        <summary>View Replies ({props.items.length})</summary>
	<CommentBox href={props.href}/>
        {props.items.map((x) => {
          return (
            <Comment
	      id={x.id}
              username={x.attributedTo.name}
              avatarURL={x.attributedTo.icon[0]}
              date={x.published}
              commentBody={x.content}
              likes={x.likes}
              dislikes={x.dislikes}
            />
          );
        })}
      </details>
    </div>
  );
}
