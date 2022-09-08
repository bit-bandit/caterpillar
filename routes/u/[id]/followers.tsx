import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../../settings.ts";
import { UserCard } from "../../../components/UserCard.tsx";
import Header from "../../../islands/Header.tsx";

export const handler: Handlers = {
  async GET(_, ctx) {
    let res = {};
    const { id } = ctx.params;

    const userAPI = new URL(`/u/${id}`, caterpillarSettings.apiURL);

    let req = await fetch(userAPI.href);

    res.user = await req.json();

    req = await fetch(res.user.followers);
    req = await req.json();

    for (const url in req.orderedItems) {
      let f = await fetch(req.orderedItems[url]);
      f = await f.json();

      let followers = await fetch(f.followers);
      followers = await followers.json();

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
      <div>
        <Header />
        <div class="mx-auto max-w-screen-md">
          <div class="text-5xl font-bold leading-tight text-center">
            <h1>Followers of {props.params.id}</h1>
          </div>
          <div class="shadow-md p-9 rounded-3xl m-11 max-w-screen-md">
            {followers.map((x) => {
              return (
                <UserCard
                  id={x.id}
                  followers={x.followers}
                  href={new URL(x.id).pathname}
                  icon={x.icon[0]}
                  name={x.name}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
