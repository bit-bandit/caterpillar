/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../../settings.ts";
import { tw } from "@twind";
import { ListItemTorrent } from "../../../components/TorrentListItem.tsx";
import { ListItemList } from "../../../components/MetaListItem.tsx";
import Header from "../../../islands/Header.tsx";

export const handler: Handlers = {
  async GET(_, ctx) {
    let res = {};
    const { id } = ctx.params;

    const userAPI = new URL(`/u/${id}`, caterpillarSettings.apiURL);

    let req = await fetch(userAPI.href, {
      headers: {
        "Accept": "application/activity+json",
      },
    });

    res.user = await req.json();

    req = await fetch(res.user.outbox, {
      headers: {
        "Accept": "application/activity+json",
      },
    });
    req = await req.json();

    for (let i in req.orderedItems) {
      req.orderedItems[i] = req.orderedItems[i].object;
    }

    req.orderedItems = req.orderedItems.filter((x) => !x.inReplyTo);

    for (let i = 0; i < req.orderedItems.length; i++) {
      const actorData = await fetch(req.orderedItems[i].attributedTo, {
        headers: {
          "Accept": "application/activity+json",
        },
      });
      req.orderedItems[i].actor = await actorData.json();

      const likes = await (await fetch(`${req.orderedItems[i].id}/likes`, {
        headers: {
          "Accept": "application/activity+json",
        },
      }))
        .json();
      const dislikes =
        await (await fetch(`${req.orderedItems[i].id}/dislikes`, {
          headers: {
            "Accept": "application/activity+json",
          },
        }))
          .json();

      req.orderedItems[i].likes = likes.totalItems;
      req.orderedItems[i].dislikes = dislikes.totalItems;

      if (req.orderedItems[i].type === "OrderedCollection") {
        for (let url of req.orderedItems[i].orderedItems) {
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

          let u = new URL(url);

          const index = req.orderedItems[i].orderedItems.indexOf(url);

          if (subObj.type !== "Note") {
            req.orderedItems[i].orderedItems[index] = {
              "type": subObj.type,
              "name": subObj.name,
              "likes": likes.totalItems,
              "dislikes": dislikes.totalItems,
              "url": u.pathname,
              "totalItems": subObj.totalItems,
            };
          } else {
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
    }

    res.outbox = req.orderedItems.reverse();

    return ctx.render(res);
  },
};

function UserBox(props: any) {
  return (
    <div>
      <div
        class={tw`flex max-w-xl max-h-16 p-3 shadow-md items-center place-content-between rounded-2xl my-4 mx-auto hover:bg-gray-100 hover:shadow-lg`}
      >
        <p class={tw`text-xl hover:underline`}>
          <a href={props.href}>{props.name}</a>
        </p>
        <svg
          class={tw`w-3 fill-gray-400 object-right`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
        </svg>
      </div>
    </div>
  );
}

export default function User(props: PageProps) {
  const user = props.data.user;
  const outbox = props.data.outbox.slice(0, 10); // I hate this

  return (
    <div>
      <Header />
      <div class={tw`mx-auto max-w-screen-md`}>
        <div class={tw`shadow-md p-9 rounded-2xl m-11 max-w-screen-md`}>
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
                  {`${props.params.id}@${props.url.host}`}
                </h2>
              </div>
            </div>
          </div>
          <div class={tw`mx-48 max-w-xl break-words`}>
            <p>{user.summary}</p>
          </div>
          <div class={tw`mx-3`}>
            <UserBox name="Likes" href={`${props.url.pathname}/likes`} />
            <UserBox
              name="Following"
              href={`${props.url.pathname}/following`}
            />
          </div>
        </div>
        <h1 class={tw`font-bold text-3xl text-center`}>Recent Uploads</h1>
        <div>
          {outbox.map((x) => {
            if (x.type === "OrderedCollection") {
              return (
                <ListItemList
                  href={new URL(x.id).pathname}
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
                href={new URL(x.id).pathname}
                name={x.name}
                uploaderHref={new URL(x.actor.id).pathname}
                uploader={x.actor.name}
                icon={x.actor.icon[0]}
                date={x.published}
                likes={x.likes}
                dislikes={x.dislikes}
                magnet={x.attachment.href}
              />
            );
          })}
          <div
            class={tw`flex max-h-16 p-3 shadow-md items-center place-content-between rounded-2xl my-9 mx-auto hover:bg-gray-100 hover:shadow-lg max-w-lg
	  `}
          >
            <p class={tw`text-xl hover:underline`}>
              <a href={`${props.url.pathname}/outbox`}>
                All posts by {user.name} ({props.data.outbox.length})
              </a>
            </p>
            <svg
              class={tw`w-3 fill-gray-400 object-right`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z">
              </path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
