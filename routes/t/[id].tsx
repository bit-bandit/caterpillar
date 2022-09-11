import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import { Comment, RenderReplies } from "../../components/Comment.tsx";
import Header from "../../islands/Header.tsx";
import CommentBox from "../../islands/CommentBox.tsx";
import Likes from "../../islands/Likes.tsx";
import Dislikes from "../../islands/Dislikes.tsx";
import Undo from "../../islands/Undo.tsx";
import * as ammonia from "https://deno.land/x/ammonia@0.3.1/mod.ts";

await ammonia.init();

// Handling
export const handler: Handlers = {
  async GET(_, ctx) {
    const res = {};
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

      const actor = await fetch(f.attributedTo);
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

        const replyActor = await fetch(r.attributedTo);
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

    let home = await fetch(caterpillarSettings.apiURL, {
      headers: {
        "Accept": "application/activity+json",
      },
    });

    home = await home.json();

    res.home = home;

    return ctx.render(res);
  },
};

export default function Torrent(props: PageProps) {
  const submitter = props.data.user;
  const torrent = props.data.torrent;

  return (
    <>
      <Head>
        <title>{torrent.name} | {props.data.home.name}</title>
      </Head>
      <div>
        <Header />
        <div class="mx-auto max-w-screen-md">
          <div class="text-5xl font-bold leading-tight text-center">
            <h1>{torrent.name}</h1>
          </div>
          <div class="m-3 flex content-center gap-12 px-28">
            <a href={torrent.attributedTo}>
              <div class="px-6 py-3 rounded-2xl shadow-md text-center flex gap-6 hover:bg-gray-100 hover:shadow-lg">
                <div class="w-6 h-6 rounded-full">
                  <img class="rounded-full" src={submitter.icon[0]} />
                </div>
                <div class="font-bold">
                  {submitter.name}
                </div>
              </div>
            </a>
            <a href={torrent.attachment.href}>
              <div class="px-6 py-3 rounded-2xl shadow-md text-center hover:bg-gray-100 hover:shadow-lg">
                Magnet
              </div>
            </a>
            <div class="px-6 py-3 rounded-2xl shadow-md text-center hover:bg-gray-100 hover:shadow-lg">
              <div class="flex">
                <p class="mx-2">Score</p>
                <div class="flex item-center">
                  <Likes total={torrent.likes} />
                  <p>/</p>
                  <Dislikes total={torrent.dislikes} />
                  <p class="mx-1" />
                  <Undo />
                </div>
              </div>
            </div>
          </div>
          <div
            id="description"
            class="p-6 shadow-md rounded-2xl"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: ammonia.clean(torrent.content),
              }}
            />
            <div class="m-1 mt-3 border-t-2 flex">
              <p class="m-4 font-bold">Tags:</p>
              {torrent.tag.map((x) => {
                return (
                  <a
                    class="mr-2 my-3 rounded-md bg-white px-2 py-1 shadow-md hover:bg-gray-100 hover:underline hover:shadow-lg"
                    href={(new URL(x)).pathname}
                  >
                    {(new URL(x)).pathname.split("/")[2]}
                  </a>
                );
              })}
            </div>
          </div>
          <br />
          <h1 class="text-4xl font-bold leading-tight snap-center text-center">
            Replies
          </h1>
          <CommentBox />
          <div>
            {torrent.replies.orderedItems.reverse().map((x) => {
              return (
                <div>
                  <Comment
                    id={x.id}
                    username={x.attributedTo.name}
                    avatarURL={x.attributedTo.icon[0]}
                    date={x.published}
                    commentBody={x.content}
                    likes={x.likes}
                    dislikes={x.dislikes}
                  />
                  <RenderReplies href={x.id} items={x.replies} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
