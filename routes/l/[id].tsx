/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";

import { ListItemTorrent } from "../../components/TorrentListItem.tsx";
import { ListItemList } from "../../components/MetaListItem.tsx";
import { Comment, RenderReplies } from "../../components/Comment.tsx";
import Header from "../../islands/Header.tsx";
import CommentBox from "../../islands/CommentBox.tsx";
import Likes from "../../islands/Likes.tsx";
import Dislikes from "../../islands/Dislikes.tsx";
import Undo from "../../islands/Undo.tsx";

import { tw } from "@twind";

import * as ammonia from "https://deno.land/x/ammonia@0.3.1/mod.ts";

await ammonia.init();

// Handling
export const handler: Handlers = {
  async GET(_, ctx) {
    let res = {};
    const { id } = ctx.params;

    const listAPI = new URL(`/l/${id}`, caterpillarSettings.apiURL);

    // List object
    let req = await fetch(listAPI.href, {
      headers: {
        "Accept": "application/activity+json",
      },
    });

    res.list = await req.json();

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

      if (fetched.orderedItems) {
        for (let url of fetched.orderedItems) {
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

          let u = new URL(url);

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

    for (const comment in req.orderedItems) {
      let f = await fetch(req.orderedItems[comment], {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      f = await f.json();

      let actor = await fetch(f.attributedTo, {
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

      for (const reply in replies.orderedItems) {
        let r = await fetch(replies.orderedItems[reply], {
          headers: {
            "Accept": "application/activity+json",
          },
        });
        r = await r.json();

        let replyActor = await fetch(r.attributedTo, {
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
      <div>
        <Header />
        <div class={tw`p-4 mx-auto max-w-screen-md`}>
          <div class={tw`text-5xl font-bold leading-tight text-center`}>
            <h1>{list.name}</h1>
          </div>
          <div class={tw`m-3 flex justify-center gap-12`}>
            <div
              class={tw`justify-center px-6 py-3 rounded-2xl shadow-md text-center flex gap-6 hover:bg-gray-100 hover:shadow-lg`}
            >
              <div class={tw`w-6 h-6 rounded-2xl`}>
                <img class={tw`rounded-full`} src={submitter.icon[0]} />
              </div>
              <div class={tw`font-bold`}>
                <a href={new URL(list.attributedTo).pathname}>
                  {submitter.name}
                </a>
              </div>
            </div>
            <div
              class={tw`px-6 py-3 rounded-2xl shadow-md text-center hover:bg-gray-100 hover:shadow-lg flex justify-center`}
            >
              <div class={tw`flex`}>
                <p class={tw`mx-2`}>Score</p>
                <div class={tw`flex item-center`}>
                  <Likes total={list.likes} />
                  <p>/</p>
                  <Dislikes total={list.dislikes} />
                  <p class={tw`mx-1`} />
                  <Undo />
                </div>
              </div>
            </div>
          </div>
          <div
            id="description"
            class={tw`p-6 shadow-md rounded-2xl my-3`}
          >
            <div
              dangerouslySetInnerHTML={{ __html: ammonia.clean(list.summary) }}
            />
            <div class={tw`m-1 mt-3 border-t-2 flex`}>
              <p class={tw`m-4 font-bold`}>Tags:</p>
              {list.tag.map((x) => {
                return (
                  <a
                    class={tw`mr-2 my-3 rounded-md bg-white px-2 py-1 shadow-md hover:bg-gray-100 hover:underline hover:shadow-lg`}
                    href={(new URL(x)).pathname}
                  >
                    {(new URL(x)).pathname.split("/")[2]}
                  </a>
                );
              })}
            </div>
          </div>
          <div class={tw`text-3xl font-bold leading-tight text-center`}>
            <h2>Items</h2>
          </div>
          <div class="m-auto">
            {list.orderedItems.map((x) => {
              if (x.type === "OrderedCollection") {
                return (
                  <ListItemList
                    href={(new URL(x.id)).pathname}
                    name={x.name}
                    uploaderHref={new URL(x.actor.id).pathname}
                    uploader={x.actor.name}
                    icon={x.actor.icon[0]}
                    date={list.published}
                    likes={x.likes.orderedItems.length}
                    dislikes={x.dislikes.orderedItems.length}
                    subitems={x.orderedItems}
                  />
                );
              }
              return (
                <ListItemTorrent
                  href={(new URL(x.id)).pathname}
                  name={x.name}
                  uploaderHref={new URL(x.actor.id).pathname}
                  uploader={x.actor.name}
                  icon={x.actor.icon[0]}
                  date={list.published}
                  likes={x.likes.orderedItems.length}
                  dislikes={x.dislikes.orderedItems.length}
                  magnet={x.attachment.href}
                />
              );
            })}
          </div>
          <br />
          <h1
            class={tw`text-4xl font-bold leading-tight snap-center text-center`}
          >
            Replies
          </h1>
          <CommentBox />
          <div>
            {list.replies.orderedItems.map((x) => {
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
