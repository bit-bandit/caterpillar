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

    res.pageEntry = parseInt(new URLSearchParams(c.search).get("p") ?? 1);

    // Stolen from https://stackoverflow.com/a/37826698/19832997
    res.orderedItems = res.orderedItems.reduce((all, one, i) => {
      const ch = Math.floor(i / 15);
      all[ch] = [].concat(all[ch] || [], one);
      return all;
    }, []);

    res.metaTotalPages = res.orderedItems.length;
    res.orderedItems = res.orderedItems[res.pageEntry - 1]; // Account for zero-based

    return ctx.render(res);
  },
};

// Basic date ranges
function Ranges(props: {
  url: string;
}) {
  const c = new URLSearchParams(new URL(props.url).search);

  c.set("r", "1w");
  const res1w = `/s?${c.toString()}`;
  c.set("r", "1m");
  const res1m = `/s?${c.toString()}`;
  c.set("r", "1y");
  const res1y = `/s?${c.toString()}`;

  return (
    <div class="m-2">
      <details>
        <summary class="w-16 bg-white text-center rounded-md shadow-md list-none py-2 hover:bg-gray-100">
          Range
        </summary>
        <div class="absolute w-30 bg-white text-center rounded-md shadow-md mt-2">
          <a href={res1w}>
            <div class="text flex items-center px-4 py-1 hover:bg-gray-100">
              This Week
            </div>
          </a>
          <a href={res1m}>
            <div class="text flex items-center px-4 py-1 hover:bg-gray-100">
              This Month
            </div>
          </a>
          <a href={res1y}>
            <div class="text flex items-center px-4 py-1 hover:bg-gray-100">
              This Year
            </div>
          </a>
        </div>
      </details>
    </div>
  );
}

// Sort by new, or top.
function Sortable(props: {
  url: string;
}) {
  const c = new URLSearchParams(new URL(props.url).search);

  c.set("s", "new");
  const resNew = `/s?${c.toString()}`;
  c.set("s", "top");
  const resTop = `/s?${c.toString()}`;

  return (
    <div class="m-2">
      <details>
        <summary class="w-16 bg-white text-center rounded-md shadow-md list-none py-2 hover:bg-gray-100">
          Sort
        </summary>
        <div class="absolute w-30 bg-white text-center rounded-md shadow-md mt-2">
          <a href={resTop}>
            <div class="text flex items-center px-4 py-1 hover:bg-gray-100">
              Top
            </div>
          </a>
          <a href={resNew}>
            <div class="text flex items-center px-4 py-1 hover:bg-gray-100">
              New
            </div>
          </a>
        </div>
      </details>
    </div>
  );
}

// Deal with page navigation
function DeterminePages(props: {
  pageEntry: number;
  total: number;
  url: string;
}) {
  if (props.total === 0 || props.total === 1) {
    return;
  }

  const p = new URLSearchParams(new URL(props.url).search);
  if (props.pageEntry === 1) {
    p.set("p", props.pageEntry + 1);
    const res = `/s?${p.toString()}`;

    return (
      <div class="flex justify-between">
        <div class="flex justify-left"></div>
        <a href={res}>
          <div class="flex justify-right hover:underline">
            Next<svg
              class="w-3 fill-gray-400 mx-2 object-right"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -256 1792 1792"
            >
              <path
                d="M1099 704q0-52-37-91L410-38q-37-37-90-37t-90 37l-76 75q-37 39-37 91 0 53 37 90l486 486-486 485q-37 39-37 91 0 53 37 90l76 75q36 38 90 38t90-38l652-651q37-37 37-90z"
                style="fill:currentColor"
                transform="matrix(1 0 0 -1 349 1331)"
              />
            </svg>
          </div>
        </a>
      </div>
    );
  } else if (props.pageEntry > 1 && props.total > props.pageEntry) {
    p.set("p", props.pageEntry + 1);
    const res1 = `/s?${p.toString()}`;

    p.set("p", props.pageEntry - 1);
    const res2 = `/s?${p.toString()}`;

    return (
      <div class="flex justify-between">
        <a href={res2}>
          <div class="flex justify-left hover:underline">
            <svg
              class="w-3 fill-gray-400 mx-2 object-right"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -256 1792 1792"
            >
              <path
                d="M742-37 90 614q-37 37-37 91 0 53 37 90l652 651q37 37 91 37 53 0 90-37l75-75q37-37 37-90 0-54-37-91L512 704l486-485q37-38 37-91t-37-90l-75-75q-37-37-90-37-54 0-91 37z"
                style="fill:currentColor"
                transform="matrix(1 0 0 -1 387 1339)"
              />
            </svg>Last
          </div>
        </a>
        <a href={res1}>
          <div class="flex justify-right hover:underline">
            Next<svg
              class="w-3 fill-gray-400 mx-2 object-right"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -256 1792 1792"
            >
              <path
                d="M1099 704q0-52-37-91L410-38q-37-37-90-37t-90 37l-76 75q-37 39-37 91 0 53 37 90l486 486-486 485q-37 39-37 91 0 53 37 90l76 75q36 38 90 38t90-38l652-651q37-37 37-90z"
                style="fill:currentColor"
                transform="matrix(1 0 0 -1 349 1331)"
              />
            </svg>
          </div>
        </a>
      </div>
    );
  } else if (props.pageEntry === props.total) {
    p.set("p", props.pageEntry - 1);
    const res = `/s?${p.toString()}`;

    return (
      <div class="flex justify-between">
        <a href={res}>
          <div class="flex justify-left hover:underline">
            <svg
              class="w-3 fill-gray-400 mx-2 object-right"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -256 1792 1792"
            >
              <path
                d="M742-37 90 614q-37 37-37 91 0 53 37 90l652 651q37 37 91 37 53 0 90-37l75-75q37-37 37-90 0-54-37-91L512 704l486-485q37-38 37-91t-37-90l-75-75q-37-37-90-37-54 0-91 37z"
                style="fill:currentColor"
                transform="matrix(1 0 0 -1 387 1339)"
              />
            </svg>Last
          </div>
        </a>
        <div class="flex justify-right"></div>
      </div>
    );
  }
}

export default function Search(props: PageProps) {
  return (
    <>
      <Head>
        <title>
          {props.data.summary} | {props.data.homeInfo.name}
        </title>
      </Head>
      <div class="flex flex-col min-h-screen">
        <Header />
        <div class="flex-1 mx-auto max-w-screen-md">
          <div class="text-3xl font-bold leading-tight text-center m-6">
            <h1>Search results</h1>
          </div>
          <div class="flex">
            <Sortable url={props.url.href} />
            <Ranges url={props.url.href} />
          </div>
          <div class="bg-white shadow-md p-5 rounded-2xl m-0 max-w-screen-md">
            {props.data.orderedItems.map((x) => {
              if (x.type === "OrderedCollection") {
                return (
                  <ListItemList
                    href={x.id}
                    name={x.name}
                    uploaderHref={x.actor.id}
                    uploader={x.actor.name}
                    icon={x.actor.icon[0]}
                    date={x.published}
                    likes={x.likes}
                    dislikes={x.dislikes}
                    subitems={x.orderedItems}
                  />
                );
              } else {
                return (
                  <ListItemTorrent
                    href={x.id}
                    name={x.name}
                    uploaderHref={x.actor.id}
                    uploader={x.actor.name}
                    icon={x.actor.icon[0]}
                    date={x.published}
                    likes={x.likes}
                    dislikes={x.dislikes}
                    magnet={x.attachment.href}
                  />
                );
              }
            })}
            <div class="px-3 py-2">
              <DeterminePages
                pageEntry={props.data.pageEntry}
                total={props.data.metaTotalPages}
                url={props.url.href}
              />
            </div>
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
}
