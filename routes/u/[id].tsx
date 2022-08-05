/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import { tw } from "@twind";
import { ListItemTorrent } from "../../components/TorrentListItem.tsx";
import { ListItemList } from "../../components/MetaListItem.tsx";

export const handler = {
  async GET(_, ctx) {
    let res = {};
    const { id } = ctx.params;

    const torrentAPI = new URL(`/u/${id}`, caterpillarSettings.apiURL);

    let req = await fetch(torrentAPI.href);

    res.user = await req.json();

    req = await fetch(res.user.outbox);
    req = await req.json();

    for (let i in req.orderedItems) {
      req.orderedItems[i] = req.orderedItems[i].object;
    }

    req.orderedItems = req.orderedItems.filter((x) => !x.inReplyTo);

    for (let i = 0; i < req.orderedItems.length; i++) {
      const actorData = await fetch(req.orderedItems[i].attributedTo);
      req.orderedItems[i].actor = await actorData.json();

      const likes = await (await fetch(`${req.orderedItems[i].id}/likes`))
        .json();
      const dislikes = await (await fetch(`${req.orderedItems[i].id}/dislikes`))
        .json();

      req.orderedItems[i].likes = likes.totalItems;
      req.orderedItems[i].dislikes = dislikes.totalItems;

      if (req.orderedItems[i].type === "OrderedCollection") {
        for (let url of req.orderedItems[i].orderedItems) {
          let subObj = await fetch(url);
          subObj = await subObj.json();

          const likes = await (await fetch(`${url}/likes`)).json();
          const dislikes = await (await fetch(`${url}/dislikes`)).json();

          let u = new URL(url);

          const index = req.orderedItems[i].orderedItems.indexOf(url);

          req.orderedItems[i].orderedItems[index] = {
            "type": subObj.type,
            "name": subObj.name,
            "likes": likes.totalItems,
            "dislikes": dislikes.totalItems,
            "url": u.pathname,
          };
        }
      }
    }

    res.outbox = req.orderedItems.reverse();

    return ctx.render(res);
  },
};

export default function User(props: any) {
  const user = props.data.user;
  const outbox = props.data.outbox;
  return (
    <div class={tw`mx-auto max-w-screen-md`}>
      <div class={tw`shadow-lg px-9 py-11 rounded-3xl m-11`}>
        <div class={tw`relative`}>
          <img
            class={tw`rounded-2xl my-3 mx-auto object-fill min-w-full`}
            src={user.image}
          />
          <div class={tw`flex`}>
            <div class={tw`p-4`}>
              <img
                class={tw`absolute -bottom-6 w-40 rounded-full shadow-md`}
                src={user.icon[0]}
              />
            </div>
            <br />
            <div>
              <h1 class={tw`mx-40 text-2xl py-1 font-bold`}>{user.name}</h1>
              <h2 class={tw`mx-40 text-gray-500`}>
                {`${user.name}@${props.url.host}`}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <h1 class={tw`font-bold text-3xl text-center`}>Recent Uploads</h1>
      <div>
        {outbox.map((x) => {
          if (x.type === "OrderedCollection") {
            return (
              <ListItemList
                href={(new URL(x.id)).pathname}
                name={x.name}
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
