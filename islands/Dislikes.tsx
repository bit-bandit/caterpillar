/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { caterpillarSettings } from "../settings.ts";

export default function Dislikes(props: any) {
  const handleVote = async () => {
    const objURL = props.href ??
      (new URL(
        new URL(window.location.href).pathname,
        caterpillarSettings.apiURL,
      )).href;

    console.log(objURL);

    let token = await caches.open("parasite");
    token = await token.match("/login");
    token = await token.text();

    const r = await fetch(
      (new URL("/x/dislike", caterpillarSettings.apiURL)).href,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          "type": "Dislike",
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
      <button class={tw`text-red-700`} onClick={handleVote}>
        -{props.total}
      </button>
    </div>
  );
}
