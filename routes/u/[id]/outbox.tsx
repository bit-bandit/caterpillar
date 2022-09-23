import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../../settings.ts";
import { ListItemTorrent } from "../../../components/TorrentListItem.tsx";
import { ListItemList } from "../../../components/MetaListItem.tsx";
import Footer from "../../../components/Footer.tsx";
import Header from "../../../islands/Header.tsx";

export const handler = {
  async GET(_, ctx) {
    const res = {};
    const { id } = ctx.params;

    const userAPI = new URL(`/u/${id}`, caterpillarSettings.apiURL);
    let req = await fetch(userAPI.href, {
      headers: {
        "Accept": "application/activity+json",
      },
    });
    req = await req.json();

    req = await fetch(req.outbox, {
      headers: {
        "Accept": "application/activity+json",
      },
    });
    req = await req.json();

    for (const i in req.orderedItems) {
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
        for (const url of req.orderedItems[i].orderedItems) {
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

          const index = req.orderedItems[i].orderedItems.indexOf(url);

          req.orderedItems[i].orderedItems[index] = {
            "type": subObj.type,
            "name": subObj.name,
            "likes": likes.totalItems,
            "dislikes": dislikes.totalItems,
            "url": u.pathname,
          };

          if (subObj.totalItems) {
            req.orderedItems[i].orderedItems[index].totalItems =
              subObj.totalItems;
          }
        }
      }
    }

    res.outbox = req.orderedItems.reverse();

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

function UserBox(props: {
  href: string;
  name: string;
}) {
  return (
    <div class="flex max-w-xl max-h-16 p-3 shadow-md items-center place-content-between rounded-2xl my-4 mx-auto hover:bg-gray-100 hover:shadow-lg">
      <p class="text-xl hover:underline">
        <a href={props.href}>{props.name}</a>
      </p>
      <svg
        class="w-3 fill-gray-400 object-right"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
      >
        <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
      </svg>
    </div>
  );
}

export default function Outbox(props: PageProps) {
  const outbox = props.data.outbox;

  return (
    <>
      <Head>
        <title>Posts by {props.params.id} | {props.data.home.name}</title>
      </Head>
      <div class="flex flex-col min-h-screen">
        <Header />
        <div class="flex-1 mx-auto max-w-screen-md">
          <div class="text-5xl font-bold leading-tight text-center">
            <h1>Posts by {props.params.id}</h1>
          </div>
          <div class="bg-white shadow-md p-9 rounded-2xl m-11 max-w-screen-md">
            {outbox.map((x) => {
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
