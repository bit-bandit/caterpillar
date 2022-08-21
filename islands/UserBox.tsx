/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { SmallSearchBar } from "./SearchBar.tsx";
import { caterpillarSettings } from "../settings.ts";
import { SmallUserCard } from "../components/UserCard.tsx";

export default function UserBox() {
  let [info, setInfo] = useState({ "err": "true", "msg": "No token found" });

  useEffect(async () => {
    let token = "";

    const c = await caches.open("parasite");
    let res = await c.match("/login");

    if (res !== undefined) {
      token = await res.text();
    } else {
      return setInfo(info);
    }

    const checkURL = new URL("/u", caterpillarSettings.apiURL);
    console.log(`Bearer ${token}`);
    res = await fetch(checkURL.href, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    res = await res.json();

    if (!res.err) {
      setInfo(res);
    }
  }, []);

  if (!info.err) {
    return <SmallUserCard obj={info} />;
  } else {
    return (
      <a href="/login">
        <h3 class={tw`hover:underline`}>Login</h3>
      </a>
    );
  }
}
