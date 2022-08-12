/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../../settings.ts";
import { tw } from "@twind";
import { ListItemTorrent } from "../../../components/TorrentListItem.tsx";
import { ListItemList } from "../../../components/MetaListItem.tsx";

export const handler = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    let res = {};
    let userAPI = new URL(`/u/${id}`, caterpillarSettings.apiURL);

    let req = await fetch(userAPI.href);
    res.user = await req.json();

    userAPI = new URL(`/u/${id}/likes`, caterpillarSettings.apiURL);

    req = await fetch(userAPI.href);
    res.likes = await req.json();

    // TODO: Add an `accept` header to make sure we're not getting any JSON.
    for (let url in res.likes.orderedItems) {
      let fetched = await fetch(res.likes.orderedItems[url]);
      fetched = await fetched.json();

      if (!fetched.err) {
        let f = await fetch(fetched.attributedTo);
        fetched.actor = await f.json();

        f = await fetch(`${res.likes.orderedItems[url]}/likes`);
        fetched.likes = (await f.json()).totalItems;

        f = await fetch(`${res.likes.orderedItems[url]}/dislikes`);
        fetched.dislikes = (await f.json()).totalItems;
        if (fetched.type === "OrderedCollection") {
          for (let url in fetched.orderedItems) {
            let subObj = await fetch(fetched.orderedItems[url]);
            subObj = await subObj.json();

            const likes =
              await (await fetch(`${fetched.orderedItems[url]}/likes`)).json();
            const dislikes =
              await (await fetch(`${fetched.orderedItems[url]}/dislikes`))
                .json();

            let u = new URL(fetched.orderedItems[url]);

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
    return ctx.render(res);
  },
};

export default function Likes(props: any) {
  const likes = props.data.likes;
  return (
    <div class={tw`mx-auto max-w-screen-md`}>
      <div class={tw`text-5xl font-bold leading-tight text-center`}>
        <h1>Liked by {props.params.id}</h1>
      </div>
      <div class={tw`shadow-md p-9 rounded-3xl m-11 max-w-screen-md`}>
        {likes.orderedItems.map((x) => {
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
  );
}