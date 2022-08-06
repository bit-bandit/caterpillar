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

    const listAPI = new URL(`/l/${id}`, caterpillarSettings.apiURL);

    // List object
    let req = await fetch(listAPI.href);
    res.list = await req.json();

    for (let i = 0; i < res.list.orderedItems.length; i++) {
      let fetched = await fetch(res.list.orderedItems[i]);
      fetched = await fetched.json();

      if (fetched.orderedItems) {
        for (let url of fetched.orderedItems) {
          let subObj = await fetch(url);

          subObj = await subObj.json();

          const likes = await (await fetch(`${url}/likes`))
            .json();
          const dislikes = await (await fetch(`${url}/dislikes`)).json();

          let u = new URL(url);

          const index = fetched.orderedItems.indexOf(url);

          fetched.orderedItems[index] = {
            "type": subObj.type,
            "name": subObj.name,
            "likes": likes.totalItems,
            "dislikes": dislikes.totalItems,
            "url": u.pathname,
          };
        }
      }

      res.list.orderedItems[i] = fetched;

      fetched = await fetch(`${res.list.orderedItems[i].id}/likes`);
      res.list.orderedItems[i].likes = await fetched.json();
      fetched = await fetch(`${res.list.orderedItems[i].id}/dislikes`);
      res.list.orderedItems[i].dislikes = await fetched.json();

      fetched = await fetch(res.list.orderedItems[i].attributedTo);

      res.list.orderedItems[i].actor = await fetched.json();
    }

    // Actor data
    req = await fetch(res.list.attributedTo);
    res.user = await req.json();

    // Likes
    req = await fetch(`${listAPI.href}/likes`);
    res.likes = await req.json();

    // Dislikes
    req = await fetch(`${listAPI.href}/dislikes`);
    res.dislikes = await req.json();

    // Replies
    req = await fetch(res.list.replies);

    res.replies = req;
    return ctx.render(res);
  },
};

export default function List(props: PageProps) {
  const list = props.data.list;
  const submitter = props.data.user;

  return (
    <div>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <div class={tw`text-5xl font-bold leading-tight text-center`}>
          <h1>{list.name}</h1>
        </div>
	<div class={tw`grid grid-cols-2 gap-12 content-center px-28 m-3`}>
          <div
            class={tw`justify-center px-6 py-3 rounded-3xl shadow-lg text-center flex gap-6 hover:bg-gray-100 hover:shadow-xl`}
          >
            <div class={tw`w-6 h-6 rounded-3xl`}>
              <img class={tw`rounded-full`} src={submitter.icon[0]} />
            </div>
            <div class={tw`font-bold`}>
              <a href={new URL(list.attributedTo).pathname}>{submitter.name}</a>
            </div>
          </div>
          <div
            class={tw`px-6 py-3 rounded-full shadow-lg text-center hover:bg-gray-100 hover:shadow-xl justify-center`}
          >
            <a href="">Score</a>
          </div>
        </div>
        <div
          id="description"
          class={tw`m-4 p-6 shadow-md rounded-3xl`}
          dangerouslySetInnerHTML={{ __html: list.summary }}
        />
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
      </div>
    </div>
  );
}
