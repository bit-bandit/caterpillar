import { IS_BROWSER } from "$fresh/runtime.ts";
import CommentBox from "../islands/CommentBox.tsx";
import Likes from "../islands/Likes.tsx";
import Dislikes from "../islands/Dislikes.tsx";
import Undo from "../islands/Undo.tsx";
import * as ammonia from "https://deno.land/x/ammonia@0.3.1/mod.ts";

await ammonia.init();

export function Comment(props: unknown) {
  const d = new Date(props.date);
  const username = new URL(props.actor).pathname.split("/")[2];

  return (
    <div class="m-4 flex max-w-3xl items-center rounded-2xl py-4 px-5 shadow-md bg-white">
      <div class="w-16">
        <a href={props.actor}>
          <img
            class="rounded-full shadow-md"
            src={props.avatarURL}
            alt={`Avatar for ${props.username}`}
          />
        </a>
      </div>
      <div class="flex-none">
        <div
          class="max-w-4xl flex-wrap py-1 px-5 text-base"
          dangerouslySetInnerHTML={{ __html: ammonia.clean(props.commentBody) }}
        />
        <div class="flex px-3 text-sm">
          <a href={props.actor}>
            <div class="flex">
              <div class="pl-2 font-bold">{props.username}</div>
              <p class="text-xs place-self-center px-1 text-gray-600">
                {`@${username}@${new URL(props.actor).host}`}
              </p>
            </div>
          </a>
          <p>-</p>
          <div class="px-1 italic text-slate-500">{d.toLocaleString()}</div>
          <p>-</p>
          <div class="mx-1 flex items-center">
            <Likes total={props.likes} href={props.id} />
            <div>/</div>
            <Dislikes total={props.dislikes} href={props.id} />
            <p class="mx-1" />
            <Undo href={props.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Requires an array of objects that share the same syntax as Comment
export function RenderReplies(props: {
  items: unknown[];
}) {
  return (
    <div class="px-9 mx-7">
      <details>
        <summary>View Replies ({props.items.length})</summary>
        {props.items.map((x) => {
          return (
            <Comment
              id={x.id}
              actor={x.attributedTo.id}
              username={x.attributedTo.name}
              avatarURL={x.attributedTo.icon.url}
              date={x.published}
              commentBody={x.content}
              likes={x.likes}
              dislikes={x.dislikes}
            />
          );
        })}
        <CommentBox href={props.href} />
      </details>
    </div>
  );
}
