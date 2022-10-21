import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import { ListItemTorrent } from "../../components/TorrentListItem.tsx";
import { ListItemList } from "../../components/MetaListItem.tsx";
import Footer from "../../components/Footer.tsx";
import Header from "../../islands/Header.tsx";

export const handler: Handlers = {
  async GET(_, ctx) {
    const { id } = ctx.params;

    const r = await fetch(_.url, {
      headers: {
        "Accept": "application/activity+json",
      },
    });
    const res = await r.json();

    for (let i = 0; i < res.orderedItems.length; i++) {
      if (res.orderedItems[i].item) {
        res.orderedItems[i] = res.orderedItems[i].item;
      }

      const r = await fetch(res.orderedItems[i], {
        headers: {
          "Accept": "application/activity+json",
        },
      });

      res.orderedItems[i] = await r.json();

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
      res.orderedItems[i].attributedTo = await actor.json();
    }

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

export default function Tag(props: PageProps) {
  return (
    <>
      <Head>
        <title>Tagged {props.params.id} | {props.data.home.name}</title>
      </Head>
      <div class="flex flex-col min-h-screen">
        <Header />
        <div class="flex-1 mx-auto max-w-screen-md">
          <div class="text-3xl font-bold leading-tight text-center m-6">
            <h1>Posts tagged with '{props.params.id}'</h1>
          </div>
          <div class="bg-white shadow-md p-5 rounded-2xl m-0 max-w-screen-md">
            {props.data.orderedItems.map((x) => {
              if (x.type === "OrderedCollection") {
                return (
                  <ListItemList
                    href={x.id}
                    name={x.name}
                    uploaderHref={x.attributedTo.id}
                    uploader={x.attributedTo.name}
                    icon={x.attributedTo.icon[0]}
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
                  uploaderHref={x.attributedTo.id}
                  uploader={x.attributedTo.name}
                  icon={x.attributedTo.icon[0]}
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
