import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../../settings.ts";
import { ListItemTorrent } from "../../../components/TorrentListItem.tsx";
import { ListItemList } from "../../../components/MetaListItem.tsx";
import Footer from "../../../components/Footer.tsx";
import Header from "../../../islands/Header.tsx";

export const handler: Handlers = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const res = {};

    if (id[0] === "@") {
      id = id.slice(1);
    }

    let userAPI: unknown;
    let re = /^([A-Za-z0-9_-]{1,24})@(.*)$/gm;

    if (re.test(id)) {
      let vals = /^([A-Za-z0-9_-]{1,24})@(.*)$/gm.exec(id);
      userAPI = new URL(`/u/${vals[1]}`, `http://${vals[2]}`);
    } else {
      userAPI = new URL(_.url);
    }

    let req = await fetch(userAPI.href, {
      headers: {
        "Accept": "application/activity+json",
      },
    });

    res.likes = await req.json();

    if (res.likes.err) {
      return ctx.renderNotFound();
    }

    // TODO: Add an `accept` header to make sure we're not getting any JSON.
    for (const url in res.likes.orderedItems) {
      let fetched = await fetch(res.likes.orderedItems[url], {
        headers: {
          "Accept": "application/activity+json",
        },
      });

      fetched = await fetched.json();

      if (!fetched.err) {
        let f = await fetch(fetched.attributedTo, {
          headers: {
            "Accept": "application/activity+json",
          },
        });
        fetched.actor = await f.json();

        f = await fetch(`${res.likes.orderedItems[url]}/likes`, {
          headers: {
            "Accept": "application/activity+json",
          },
        });
        fetched.likes = (await f.json()).totalItems;

        f = await fetch(`${res.likes.orderedItems[url]}/dislikes`, {
          headers: {
            "Accept": "application/activity+json",
          },
        });
        fetched.dislikes = (await f.json()).totalItems;
        if (fetched.type === "OrderedCollection") {
          for (const url in fetched.orderedItems) {
            let subObj = await fetch(fetched.orderedItems[url], {
              headers: {
                "Accept": "application/activity+json",
              },
            });
            subObj = await subObj.json();

            const likes =
              await (await fetch(`${fetched.orderedItems[url]}/likes`, {
                headers: {
                  "Accept": "application/activity+json",
                },
              })).json();
            const dislikes =
              await (await fetch(`${fetched.orderedItems[url]}/dislikes`, {
                headers: {
                  "Accept": "application/activity+json",
                },
              })).json();

            const u = new URL(fetched.orderedItems[url]);

            fetched.orderedItems[url] = {
              "type": subObj.type,
              "name": subObj.name,
              "likes": likes.totalItems,
              "dislikes": dislikes.totalItems,
              "url": u.pathname,
            };
          }
        }
      }
      res.likes.orderedItems[url] = fetched;
    }
    // Filter out comments, and errors
    res.likes.orderedItems = res.likes.orderedItems.filter((x) => !x.inReplyTo);
    res.likes.orderedItems = res.likes.orderedItems.filter((x) => !x.err);

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

export default function Likes(props: PageProps) {
  const likes = props.data.likes;
  return (
    <>
      <Head>
        <title>Liked by {props.params.id} | {props.data.home.name}</title>
      </Head>
      <div class="flex flex-col min-h-screen">
        <Header />
        <div class="flex-1 mx-auto max-w-screen-md">
          <div class="text-5xl font-bold leading-tight text-center">
            <h1>Liked by {props.params.id}</h1>
          </div>
          <div class="bg-white shadow-md p-9 rounded-2xl m-11 max-w-screen-md">
            {likes.orderedItems.map((x) => {
              if (x.type === "OrderedCollection") {
                return (
                  <ListItemList
                    href={x.id}
                    name={x.name}
                    uploaderHref={x.actor.id}
                    uploader={x.actor.name}
                    icon={x.actor.icon.url}
                    date={x.published}
                    likes={x.likes}
                    dislikes={x.dislikes}
                    subitems={x.orderedItems}
                  />
                );
              }
              return (
                <ListItemTorrent
                  href={x.id}
                  name={x.name}
                  uploaderHref={x.attributedTo}
                  uploader={x.actor.name}
                  icon={x.actor.icon.url}
                  date={x.published}
                  likes={x.likes}
                  dislikes={x.dislikes}
                  magnet={x.attachment.href}
                />
              );
            })}
          </div>
        </div>
        <br />
        <Footer />
      </div>
    </>
  );
}
