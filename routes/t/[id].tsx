import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import { Comment, RenderReplies } from "../../components/Comment.tsx";
import Footer from "../../components/Footer.tsx";
import Header from "../../islands/Header.tsx";
import CommentBox from "../../islands/CommentBox.tsx";
import Likes from "../../islands/Likes.tsx";
import Dislikes from "../../islands/Dislikes.tsx";
import Undo from "../../islands/Undo.tsx";
import IsEditable from "../../islands/IsEditable.tsx";
import * as ammonia from "https://deno.land/x/ammonia@0.3.1/mod.ts";

await ammonia.init();

// Handling
export const handler: Handlers = {
  async GET(_, ctx) {
    const res = {};
    const { id } = ctx.params;

    let torrentAPI: unknown;

    let re = /^([A-Za-z0-9_-]{1,24})@(.*)$/gm;

    if (re.test(id)) {
      let vals = /^([A-Za-z0-9_-]{1,24})@(.*)$/gm.exec(id);
      torrentAPI = new URL(`/t/${vals[1]}`, `http://${vals[2]}`);
    } else {
      torrentAPI = new URL(_.url);
    }

    let req = await fetch(torrentAPI.href, {
      headers: {
        "Accept": "application/activity+json",
      },
    });

    res.torrent = await req.json();

    if (res.torrent.err) {
      return ctx.renderNotFound();
    }

    req = await fetch(res.torrent.attributedTo, {
      headers: { "Accept": "application/activity+json" },
    });

    res.user = await req.json();

    let likes = await fetch(`${res.torrent.id}/likes`, {
      headers: { "Accept": "application/activity+json" },
    });

    likes = await likes.json();
    res.torrent.likes = likes.totalItems;

    let dislikes = await fetch(`${res.torrent.id}/dislikes`, {
      headers: { "Accept": "application/activity+json" },
    });
    dislikes = await dislikes.json();
    res.torrent.dislikes = dislikes.totalItems;

    // Comments
    req = await fetch(res.torrent.replies, {
      headers: { "Accept": "application/activity+json" },
    });
    req = await req.json();

    for (let comment = 0; comment < req.orderedItems.length; comment++) {
      let f = await fetch(req.orderedItems[comment], {
        headers: { "Accept": "application/activity+json" },
      });

      f = await f.json();

      if (f.err) {
        req.orderedItems.splice(comment, 1);
        comment = -1;
        continue;
      }

      const actor = await fetch(f.attributedTo, {
        headers: { "Accept": "application/activity+json" },
      });

      f.attributedTo = await actor.json();

      let likes = await fetch(`${f.id}/likes`, {
        headers: { "Accept": "application/activity+json" },
      });

      likes = await likes.json();
      f.likes = likes.totalItems;

      let dislikes = await fetch(`${f.id}/dislikes`, {
        headers: { "Accept": "application/activity+json" },
      });

      dislikes = await dislikes.json();
      f.dislikes = dislikes.totalItems;

      let replies = await fetch(f.replies, {
        headers: { "Accept": "application/activity+json" },
      });

      replies = await replies.json();

      for (let reply = 0; reply < replies.orderedItems.length; reply++) {
        let r = await fetch(replies.orderedItems[reply], {
          headers: { "Accept": "application/activity+json" },
        });
        r = await r.json();

        if (r.err) {
          replies.orderedItems.splice(reply, 1);
          reply = -1;
          continue;
        }

        const replyActor = await fetch(r.attributedTo, {
          headers: { "Accept": "application/activity+json" },
        });
        r.attributedTo = await replyActor.json();

        let replyLikes = await fetch(`${r.id}/likes`, {
          headers: { "Accept": "application/activity+json" },
        });
        replyLikes = await replyLikes.json();
        r.likes = replyLikes.totalItems;

        let replyDislikes = await fetch(`${r.id}/dislikes`, {
          headers: { "Accept": "application/activity+json" },
        });
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
      <div class="flex flex-col min-h-screen">
        <Header />
        <div class="flex-1 mx-auto max-w-screen-md">
          <div class="text-5xl font-bold leading-tight flex justify-center items-center text-center">
            <h1>{torrent.name}</h1>
            <IsEditable uid={torrent.attributedTo} />
          </div>
          <div class="m-3 flex content-center gap-12 px-28">
            <a href={torrent.attributedTo}>
              <div class="px-6 py-3 rounded-2xl shadow-md text-center flex gap-6 bg-white hover:bg-gray-100 hover:shadow-lg">
                <div class="w-6 h-6 rounded-full">
                  <img
                    class="rounded-full"
                    src={submitter.icon.url}
                    alt={`Avatar for ${submitter.name}`}
                  />
                </div>
                <div class="font-bold truncate">
                  {submitter.name}
                </div>
              </div>
            </a>
            <a href={torrent.attachment.href}>
              <div class="px-6 py-3 rounded-2xl shadow-md text-center bg-white hover:bg-gray-100 hover:shadow-lg">
                Magnet
              </div>
            </a>
            <div class="px-6 py-3 rounded-2xl shadow-md text-center bg-white hover:bg-gray-100 hover:shadow-lg">
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
            class="p-6 shadow-md rounded-2xl bg-white"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: ammonia.clean(torrent.content),
              }}
            />
            <div class="m-1 mt-3 border-t-2 flex flex-wrap">
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
            <p class="ml-4 text-gray-600">
              {new Date(torrent.published).toLocaleString()}
            </p>
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
                    actor={x.attributedTo.id}
                    username={x.attributedTo.name}
                    avatarURL={x.attributedTo.icon.url}
                    date={x.published}
                    commentBody={x.content}
                    likes={x.likes}
                    dislikes={x.dislikes}
                  />
                  <RenderReplies href={x.id} items={x.replies} />
                  <br />
                </div>
              );
            })}
          </div>
          <br />
        </div>
        <br />
        <Footer />
      </div>
    </>
  );
}
