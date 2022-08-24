/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import { tw } from "@twind";
import { ListItemTorrent } from "../../components/TorrentListItem.tsx";
import { ListItemList } from "../../components/MetaListItem.tsx";
import Header from "../../islands/Header.tsx";

export const handler: Handlers = {
  async GET(_, ctx) {
    const { id } = ctx.params;

    const query = new URL(
      `/i/${id}`,
      caterpillarSettings.apiURL,
    );

    const r = await fetch(query.href, {
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
      res.orderedItems[i].actor = await actor.json();
    }

    return ctx.render(res);
  },
};

export default function Tag(props: PageProps) {
  return (
    <div>
      <Header />
      <div class={tw`mx-auto max-w-screen-md`}>
        <div class={tw`text-3xl font-bold leading-tight text-center m-6`}>
          <h1>Posts tagged with '{props.params.id}'</h1>
        </div>
        <div class={tw`shadow-md p-5 rounded-2xl m-0 max-w-screen-md`}>
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
    </div>
  );
}
