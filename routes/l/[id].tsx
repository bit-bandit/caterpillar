import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";

import { ListItemTorrent } from "../../components/TorrentListItem.tsx";
import { ListItemList } from "../../components/MetaListItem.tsx";
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

    let listAPI: unknown;

    let re = /^([A-Za-z0-9_-]{1,24})@(.*)$/gm;

    if (re.test(id)) {
      let vals = /^([A-Za-z0-9_-]{1,24})@(.*)$/gm.exec(id);
      listAPI = new URL(`/l/${vals[1]}`, `http://${vals[2]}`);
    } else {
      listAPI = new URL(_.url);
    }

    // List object
    let req = await fetch(listAPI.href, {
      headers: {
        "Accept": "application/activity+json",
      },
    });

    res.list = await req.json();

    if (res.list.err) {
      return ctx.renderNotFound();
    }

    let likes = await fetch(`${res.list.id}/likes`, {
      headers: {
        "Accept": "application/activity+json",
      },
    });
    likes = await likes.json();
    res.list.likes = likes.totalItems;

    let dislikes = await fetch(`${res.list.id}/dislikes`, {
      headers: {
        "Accept": "application/activity+json",
      },
    });
    dislikes = await dislikes.json();
    res.list.dislikes = dislikes.totalItems;

    for (let i = 0; i < res.list.orderedItems.length; i++) {
      let fetched = await fetch(res.list.orderedItems[i], {
        headers: {
          "Accept": "application/activity+json",
        },
      });

      fetched = await fetched.json();

      // Absolutely abominable hack to deal with (potentially) deleted entries.
      if (fetched.err) {
        res.list.orderedItems.splice(i, 1);
        i--;
        continue;
      }

      if (fetched.orderedItems) {
        for (const url of fetched.orderedItems) {
          let subObj = await fetch(url, {
            headers: {
              "Accept": "application/activity+json",
            },
          });

          subObj = await subObj.json();

          const likes = await (await fetch(`${url}/likes`, {
            headers: {
              "Accept": "application/activity+json",
            },
          }))
            .json();
          const dislikes = await (await fetch(`${url}/dislikes`, {
            headers: {
              "Accept": "application/activity+json",
            },
          })).json();

          const u = new URL(url);

          const index = fetched.orderedItems.indexOf(url);

          fetched.orderedItems[index] = {
            "type": subObj.type,
            "name": subObj.name,
            "likes": likes.totalItems,
            "dislikes": dislikes.totalItems,
            "url": u.pathname,
          };
          // Quick check for lists.
          if (subObj.totalItems) {
            fetched.orderedItems[index].totalItems = subObj.totalItems;
          }
        }
      }

      res.list.orderedItems[i] = fetched;

      fetched = await fetch(`${res.list.orderedItems[i].id}/likes`, {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      res.list.orderedItems[i].likes = await fetched.json();
      fetched = await fetch(`${res.list.orderedItems[i].id}/dislikes`, {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      res.list.orderedItems[i].dislikes = await fetched.json();

      fetched = await fetch(res.list.orderedItems[i].attributedTo, {
        headers: {
          "Accept": "application/activity+json",
        },
      });

      res.list.orderedItems[i].actor = await fetched.json();
    }

    // Actor data
    req = await fetch(res.list.attributedTo, {
      headers: {
        "Accept": "application/activity+json",
      },
    });
    res.user = await req.json();

    // Replies
    req = await fetch(res.list.replies, {
      headers: {
        "Accept": "application/activity+json",
      },
    });

    req = await req.json();

    for (let comment = 0; comment < req.orderedItems.length; comment++) {
      let f = await fetch(req.orderedItems[comment], {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      f = await f.json();

      if (f.err) {
        req.orderedItems.splice(comment, 1);
        comment = -1;
        continue;
      }

      const actor = await fetch(f.attributedTo, {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      f.attributedTo = await actor.json();

      let likes = await fetch(`${f.id}/likes`, {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      likes = await likes.json();
      f.likes = likes.totalItems;

      let dislikes = await fetch(`${f.id}/dislikes`, {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      dislikes = await dislikes.json();
      f.dislikes = dislikes.totalItems;

      let replies = await fetch(f.replies, {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      replies = await replies.json();

      for (let reply = 0; reply < replies.orderedItems.length; reply++) {
        let r = await fetch(replies.orderedItems[reply], {
          headers: {
            "Accept": "application/activity+json",
          },
        });
        r = await r.json();

        if (r.err) {
          replies.orderedItems.splice(reply, 1);
          reply = -1;
          continue;
        }

        const replyActor = await fetch(r.attributedTo, {
          headers: {
            "Accept": "application/activity+json",
          },
        });
        r.attributedTo = await replyActor.json();

        let replyLikes = await fetch(`${r.id}/likes`, {
          headers: {
            "Accept": "application/activity+json",
          },
        });
        replyLikes = await replyLikes.json();
        r.likes = replyLikes.totalItems;

        let replyDislikes = await fetch(`${r.id}/dislikes`, {
          headers: {
            "Accept": "application/activity+json",
          },
        });
        replyDislikes = await replyDislikes.json();
        r.dislikes = replyDislikes.totalItems;

        replies.orderedItems[reply] = r;
      }
      f.replies = replies.orderedItems;
      req.orderedItems[comment] = f;
    }

    res.list.replies = req;

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

export default function List(props: PageProps) {
  const list = props.data.list;
  const submitter = props.data.user;

  return (
    <>
      <Head>
        <title>{list.name} | {props.data.home.name}</title>
      </Head>
      <div class="flex flex-col min-h-screen">
        <Header />
        <div class="flex-1 mx-auto max-w-screen-md">
          <div class="text-5xl font-bold leading-tight flex justify-center items-center text-center">
            <h1>{list.name}</h1>
            <IsEditable uid={list.attributedTo} />
          </div>
          <div class="m-3 flex justify-center gap-12">
            <div class="justify-center px-6 py-3 rounded-2xl shadow-md text-center flex gap-6 bg-white hover:bg-gray-100 hover:shadow-lg">
              <div class="w-6 h-6 rounded-2xl">
                <img
                  class="rounded-full"
                  src={submitter.icon.url}
                  alt={`Avatar for ${submitter.name}`}
                />
              </div>
              <div class="font-bold">
                <a href={new URL(list.attributedTo).pathname}>
                  {submitter.name}
                </a>
              </div>
            </div>
            <div class="px-6 py-3 rounded-2xl shadow-md text-center bg-white hover:bg-gray-100 hover:shadow-lg flex justify-center">
              <div class="flex">
                <p class="mx-2">Score</p>
                <div class="flex item-center">
                  <Likes total={list.likes} />
                  <p>/</p>
                  <Dislikes total={list.dislikes} />
                  <p class="mx-1" />
                  <Undo />
                </div>
              </div>
            </div>
          </div>
          <div
            id="description"
            class="p-6 shadow-md rounded-2xl my-3 bg-white break-all"
          >
            <div
              dangerouslySetInnerHTML={{ __html: ammonia.clean(list.summary) }}
            />
            <div class="m-1 mt-3 border-t-2 flex flex-wrap">
              <p class="m-4 font-bold">Tags:</p>
              {list.tag.map((x) => {
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
          <div class="text-3xl font-bold leading-tight text-center">
            <h2>Items</h2>
          </div>
          <div>
            {list.orderedItems.filter((x) => x.id ? true : false).map((x) => {
              if (x.type === "OrderedCollection") {
                return (
                  <ListItemList
                    href={(new URL(x.id)).pathname}
                    name={x.name}
                    uploaderHref={new URL(x.actor.id)}
                    uploader={x.actor.name}
                    icon={x.actor.icon.url}
                    date={list.published}
                    likes={x.likes.orderedItems.length}
                    dislikes={x.dislikes.orderedItems.length}
                    subitems={x.orderedItems}
                  />
                );
              }
              return (
                <ListItemTorrent
                  href={x.id}
                  name={x.name}
                  uploaderHref={x.actor.id}
                  uploader={x.actor.name}
                  icon={x.actor.icon.url}
                  date={list.published}
                  likes={x.likes.orderedItems.length}
                  dislikes={x.dislikes.orderedItems.length}
                  magnet={x.attachment.href}
                />
              );
            })}
          </div>
          <br />
          <h1 class="text-4xl font-bold leading-tight snap-center text-center">
            Replies
          </h1>
          <CommentBox />
          <div>
            {list.replies.orderedItems.map((x) => {
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
