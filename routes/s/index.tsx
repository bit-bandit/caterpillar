import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../../settings.ts";
import { ListItemTorrent } from "../../components/TorrentListItem.tsx";
import { ListItemList } from "../../components/MetaListItem.tsx";
import Footer from "../../components/Footer.tsx";
import Header from "../../islands/Header.tsx";

export const handler = {
  async GET(_, ctx) {
    const c = new URL(_.url);
    const query = new URL(
      `${c.pathname}${c.search}`,
      caterpillarSettings.apiURL,
    );

    const r = await fetch(query.href);
    const res = await r.json();

    for (let i = 0; i < res.orderedItems.length; i++) {
      // There's a bug in the API server where the behavior of either returning
      // *just* the item, or the item *and* its match score are inconsistant.
      // We'll fix that later - For now, this will do.
      if (res.orderedItems[i].item) {
        res.orderedItems[i] = res.orderedItems[i].item;
      }

      const likes = await fetch(`${res.orderedItems[i].id}/likes`, {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      res.orderedItems[i].likes = (await likes.json()).totalItems;

      const dislikes = await fetch(`${res.orderedItems[i].id}/dislikes`, {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      res.orderedItems[i].dislikes = (await dislikes.json()).totalItems;

      const actor = await fetch(res.orderedItems[i].attributedTo, {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      res.orderedItems[i].actor = await actor.json();

      if (res.orderedItems[i].orderedItems) {
        for (const url of res.orderedItems[i].orderedItems) {
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
          })).json();
          const dislikes = await (await fetch(`${url}/dislikes`, {
            headers: {
              "Accept": "application/activity+json",
            },
          })).json();

          const u = new URL(url);

          const index = res.orderedItems[i].orderedItems.indexOf(url);

          res.orderedItems[i].orderedItems[index] = {
            "type": subObj.type,
            "name": subObj.name,
            "likes": likes.totalItems,
            "dislikes": dislikes.totalItems,
            "url": u.pathname,
          };

          if (subObj.totalItems) {
            res.orderedItems[i].orderedItems[index].totalItems =
              subObj.totalItems;
          }
        }
      }
    }

    let homeInfo = await fetch(caterpillarSettings.apiURL, {
      headers: {
        "Accept": "application/activity+json",
      },
    });

    homeInfo = await homeInfo.json();

    res.homeInfo = homeInfo;

    return ctx.render(res);
  },
};

export default function Search(props: PageProps) {
  return (
    <>
      <Head>
        <title>{props.data.summary} | {props.data.homeInfo.name}</title>
      </Head>
      <div class="flex flex-col min-h-screen">
        <Header />
        <div class="flex-1 mx-auto max-w-screen-md">
          <div class="text-3xl font-bold leading-tight text-center m-6">
            <h1>Search results</h1>
          </div>
          <div class="bg-white shadow-md p-5 rounded-2xl m-0 max-w-screen-md">
            {props.data.orderedItems.map((x) => {
              if (x.type === "OrderedCollection") {
                return (
                  <ListItemList
                    href={(new URL(x.id)).pathname}
                    name={x.name}
                    uploaderHref={new URL(x.actor.id).pathname}
                    uploader={x.actor.name}
                    icon={x.actor.icon[0]}
                    date={x.published}
                    likes={x.likes}
                    dislikes={x.dislikes}
                    subitems={x.orderedItems}
                  />
                );
              }
              return (
                <ListItemTorrent
                  href={(new URL(x.id)).pathname}
                  name={x.name}
                  uploaderHref={new URL(x.attributedTo).pathname}
                  uploader={x.actor.name}
                  icon={x.actor.icon[0]}
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
