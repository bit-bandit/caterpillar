/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { caterpillarSettings } from "../settings.ts";

export default function Likes(props: any) {
  const handleVote = async () => {
    const objURL = props.url ??
      (new URL(
        new URL(window.location.href).pathname,
        caterpillarSettings.apiURL,
      )).href;

    console.log(objURL);

    let token = await caches.open("parasite");
    token = await token.match("/login");
    token = await token.text();

    const r = await fetch(
      (new URL("/x/like", caterpillarSettings.apiURL)).href,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          "type": "Like",
          "object": objURL,
        }),
      },
    );

    if (r.status === 201) {
      window.location.reload();
    } else {
      alert((await r.json()).msg);
    }
  };

  return (
    <div>
      <button class={tw`text-green-700`} onClick={handleVote}>
        +{props.total}
      </button>
    </div>
  );
}
