import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";
import { SmallUserCard } from "../components/UserCard.tsx";

export default function UserBox() {
  const [info, setInfo] = useState({});

  useEffect(async () => {
    const c = await caches.open("parasite");
    const login = await c.match("/login");
    let user = await c.match("/u");

    if (login === undefined && user === undefined) {
      setInfo({ err: true, msg: "Token/User not found" });
      return;
    }

    user = await user.json();

    setInfo(user);
  }, []);

  if (!info.err && info.icon && info.name) {
    return <SmallUserCard obj={info} />;
  } else if (info.err && info.msg) {
    return (
      <a href="/login">
        <p class="hover:underline">Login</p>
      </a>
    );
  } else if (info.msg === undefined) {
    return (
      <div class="w-8 bg-gray-100 rounded-full">
      </div>
    );
  }
}
