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
      class={tw`m-4 flex max-w-3xl items-center rounded-2xl py-4 px-5 shadow-md`}
    >
      <div class={tw`w-16`}>
        <img class={tw`rounded-full shadow-md`} src={props.avatarURL} />
      </div>
      <div class={tw`flex-none`}>
        <div
          class={tw`max-w-4xl flex-wrap py-1 px-5 text-base`}
          dangerouslySetInnerHTML={{ __html: props.commentBody }}
        />
        <div class={tw`flex px-3 text-sm`}>
          <div class={tw`px-2 font-bold`}>{props.username}</div>
          <p>-</p>
          <div class={tw`px-2 italic text-slate-500`}>{d.toLocaleString()}</div>
          <p>-</p>
          <div class={tw`mx-2 flex`}>
            <div class={tw`text-green-700`}>+{props.likes}</div>
            <div>/</div>
            <div class={tw`text-red-700`}>-{props.dislikes}</div>
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
        {props.items.map((x) => {
          return (
            <Comment
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
