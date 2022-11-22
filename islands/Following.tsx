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

    let f = await fetch(user.following, {
      headers: {
        "Accept": "application/activity+json",
      },
    });

    f = await f.json();

    setFollowing(f.orderedItems.includes(
      window.location.href,
    ));
  }, []);

  const followSubmit = async () => {
    const c = await caches.open("parasite");

    let token = await c.match("/login");
    token = await token.text();

    let user = await c.match("/u");
    user = await user.json();

    const actorURL = new URL(window.location.href);

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

    let followAttempt = await fetch(
      new URL("/x/undo", caterpillarSettings.apiURL).href,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          "object": window.location.href,
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
        title="Unfollow user"
      >
        Unfollow
      </button>
    );
  }
  return (
    <button
      class="hover:bg-gray-100 p-3 rounded-2xl shadow-md bg-white"
      onClick={followSubmit}
      title="Follow user"
    >
      Follow
    </button>
  );
}
