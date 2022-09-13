import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";

export default function FollowButton() {
  const [isFollowing, setFollowing] = useState(false);

  useEffect(async () => {
    const c = await caches.open("parasite");
    let user = await c.match("/u");

    if (user === undefined) {
      return;
    }

    user = await user.json();
    console.log(user);

    let f = await fetch(user.following, {
      headers: {
        "Accept": "application/activity+json",
      },
    });

    f = await f.json();

    console.log(f);

    setFollowing(f.orderedItems.includes(
      new URL(window.location.pathname, caterpillarSettings.apiURL).href,
    ));
  }, []);

  const followSubmit = async () => {
    const c = await caches.open("parasite");

    let token = await c.match("/login");
    token = await token.text();

    let user = await c.match("/u");
    user = await user.json();

    let actorURL =
      new URL(window.location.pathname, caterpillarSettings.apiURL).href;
    console.log(actorURL);

    if (actorURL === user.id) {
      return alert("You can't follow yourself");
    }

    let followAttempt = await fetch(
      new URL("/x/follow", caterpillarSettings.apiURL).href,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          "object": actorURL,
        }),
      },
    );

    followAttempt = await followAttempt.json();

    if (!followAttempt.err) {
      window.location.reload();
    } else {
      alert(followAttempt.msg);
    }
  };

  const undoFollow = async () => {
    const c = await caches.open("parasite");

    let token = await c.match("/login");
    token = await token.text();

    let user = await c.match("/u");
    user = await user.json();

    let actorURL =
      new URL(window.location.pathname, caterpillarSettings.apiURL).href;
    console.log(actorURL);

    let followAttempt = await fetch(
      new URL("/x/undo", caterpillarSettings.apiURL).href,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          "object": actorURL,
        }),
      },
    );

    followAttempt = await followAttempt.json();

    if (!followAttempt.err) {
      window.location.reload();
    } else {
      alert(followAttempt.msg);
    }
  };

  if (isFollowing) {
    return (
      <button
        class="hover:bg-gray-100 p-3 rounded-2xl shadow-md bg-white"
        onClick={undoFollow}
      >
        Unfollow
      </button>
    );
  }
  return (
    <button
      class="hover:bg-gray-100 p-3 rounded-2xl shadow-md bg-white"
      onClick={followSubmit}
    >
      Follow
    </button>
  );
}
