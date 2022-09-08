import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";
import { SmallUserCard } from "../components/UserCard.tsx";

export default function UserBox() {
  let [info, setInfo] = useState({ "err": "true", "msg": "No token found" });

  useEffect(async () => {
    let token = "";

    const c = await caches.open("parasite");
    const login = await c.match("/login");
    let user = await c.match("/u");

    if (login === undefined && user === undefined) {
      return;
    }

    user = await user.json();

    setInfo(user);
  }, []);

  if (!info.err) {
    return <SmallUserCard obj={info} />;
  } else {
    return (
      <a href="/login">
        <h3 class="hover:underline">Login</h3>
      </a>
    );
  }
}
