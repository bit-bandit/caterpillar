/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import { Comment, RenderReplies } from "../../components/Comment.tsx";
import Header from "../../islands/Header.tsx";

import { tw } from "@twind";

// Handling
export const handler: Handlers = {
  async GET(_, ctx) {
    let res = {};
    const { id } = ctx.params;

    const torrentAPI = new URL(`/t/${id}`, caterpillarSettings.apiURL);

    let req = await fetch(torrentAPI.href);

    res.torrent = await req.json();

    req = await fetch(res.torrent.attributedTo);
    res.user = await req.json();

    let likes = await fetch(`${res.torrent.id}/likes`);
    likes = await likes.json();
    res.torrent.likes = likes.totalItems;

    let dislikes = await fetch(`${res.torrent.id}/dislikes`);
    dislikes = await dislikes.json();
    res.torrent.dislikes = dislikes.totalItems;

    // Comments
    req = await fetch(res.torrent.replies);
    req = await req.json();

    for (const comment in req.orderedItems) {
      let f = await fetch(req.orderedItems[comment]);
      f = await f.json();

      let actor = await fetch(f.attributedTo);
      f.attributedTo = await actor.json();

      let likes = await fetch(`${f.id}/likes`);
      likes = await likes.json();
      f.likes = likes.totalItems;

      let dislikes = await fetch(`${f.id}/dislikes`);
      dislikes = await dislikes.json();
      f.dislikes = dislikes.totalItems;

      let replies = await fetch(f.replies);
      replies = await replies.json();

      for (const reply in replies.orderedItems) {
        let r = await fetch(replies.orderedItems[reply]);
        r = await r.json();

        let replyActor = await fetch(r.attributedTo);
        r.attributedTo = await replyActor.json();

        let replyLikes = await fetch(`${r.id}/likes`);
        replyLikes = await replyLikes.json();
        r.likes = replyLikes.totalItems;

        let replyDislikes = await fetch(`${r.id}/dislikes`);
        replyDislikes = await replyDislikes.json();
        r.dislikes = replyDislikes.totalItems;

        replies.orderedItems[reply] = r;
      }
      f.replies = replies.orderedItems;
      req.orderedItems[comment] = f;
    }

    res.torrent.replies = req;

    return ctx.render(res);
  },
};

export default function Torrent(props: PageProps) {
  const submitter = props.data.user;
  const torrent = props.data.torrent;

  return (
    <div>
      <Header />
      <div class={tw`mx-auto max-w-screen-md`}>
        <div class={tw`text-5xl font-bold leading-tight text-center`}>
          <h1>{torrent.name}</h1>
        </div>
        <div class={tw`grid grid-cols-3 gap-12 content-center px-28 m-3`}>
          <a href={torrent.attributedTo}>
            <div
              class={tw`px-6 py-3 rounded-2xl shadow-md text-center flex gap-6 hover:bg-gray-100 hover:shadow-lg`}
            >
              <div class={tw`w-6 h-6 rounded-full`}>
                <img class={tw`rounded-full`} src={submitter.icon[0]} />
              </div>
              <div class={tw`font-bold`}>
                {submitter.name}
              </div>
            </div>
          </a>
          <a href={torrent.attachment.href}>
            <div
              class={tw`px-6 py-3 rounded-2xl shadow-md text-center hover:bg-gray-100 hover:shadow-lg`}
            >
              Magnet
            </div>
          </a>
          <div
            class={tw`px-6 py-3 rounded-2xl shadow-md text-center hover:bg-gray-100 hover:shadow-lg`}
          >
            <div class={tw`flex`}>
              <p class={tw`mx-2`}>Score</p>
              <div class={tw`flex`}>
                <p class={tw`text-green-700`}>+{torrent.likes}</p>
                <p>/</p>
                <p class={tw`text-red-700`}>-{torrent.dislikes}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          id="description"
          class={tw`p-6 shadow-md rounded-2xl`}
          dangerouslySetInnerHTML={{ __html: torrent.content }}
        />
        <br />
        <h1
          class={tw`text-4xl font-bold leading-tight snap-center text-center`}
        >
          Replies
        </h1>

        <div>
          {torrent.replies.orderedItems.map((x) => {
            return (
              <div>
                <Comment
                  username={x.attributedTo.name}
                  avatarURL={x.attributedTo.icon[0]}
                  date={x.published}
                  commentBody={x.content}
                  likes={x.likes}
                  dislikes={x.dislikes}
                />
                <RenderReplies items={x.replies} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
