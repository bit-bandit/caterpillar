import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../../settings.ts";
import { UserCard } from "../../../components/UserCard.tsx";
import Footer from "../../../components/Footer.tsx";
import Header from "../../../islands/Header.tsx";

export const handler: Handlers = {
  async GET(_, ctx) {
    const res = {};
    const { id } = ctx.params;

    let userAPI: unknown;
    let re = /^([A-Za-z0-9_-]{1,24})@(.*)$/gm;

    if (re.test(id)) {
      let vals = /^([A-Za-z0-9_-]{1,24})@(.*)$/gm.exec(id);
      userAPI = new URL(`/u/${vals[1]}`, `http://${vals[2]}`);
    } else {
      userAPI = new URL(_.url);
    }

    let req = await fetch(userAPI.href);

    res.user = await req.json();

    if (res.user.err) {
      return ctx.renderNotFound();
    }

    req = await fetch(res.user.followers, {
      headers: { "Accept": "application/activity+json" },
    });

    req = await req.json();

    if (req.err) {
      return ctx.renderNotFound();
    }

    for (const url in req.orderedItems) {
      let f = await fetch(req.orderedItems[url], {
        headers: { "Accept": "application/activity+json" },
      });

      f = await f.json();

      let followers = await fetch(f.followers, {
        headers: { "Accept": "application/activity+json" },
      });
      followers = await followers.json();

      if (followers.err) {
        continue;
      }

      f.followers = followers.totalItems;

      req.orderedItems[url] = f;
    }

    res.followers = req.orderedItems;

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

export default function Followers(props: PageProps) {
  const followers = props.data.followers;
  return (
    <>
      <Head>
        <title>Followers of {props.params.id} | {props.data.home.name}</title>
      </Head>
      <div class="flex flex-col min-h-screen">
        <Header />
        <div class="flex-1 mx-auto max-w-screen-md">
          <div class="text-5xl font-bold leading-tight text-center">
            <h1>Followers of {props.params.id}</h1>
          </div>
          <div class="bg-white shadow-md p-9 rounded-3xl m-11 max-w-screen-md">
            {followers.map((x) => {
              return (
                <UserCard
                  id={x.id}
                  followers={x.followers}
                  href={new URL(x.id).pathname}
                  icon={x.icon.url}
                  name={x.name}
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
