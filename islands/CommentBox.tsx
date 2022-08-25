/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../settings.ts";
import { useEffect, useState } from "preact/hooks";
import { tw } from "@twind";

export default function CommentBox(props: any) {
  let [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    inputs.type = "Create";
    inputs.inReplyTo = (new URL(
      (new URL(window.location.href)).pathname,
      caterpillarSettings.apiURL,
    )).href;

    let token = await caches.open("parasite");
    token = await token.match("/login");
    token = await token.text();

    const API = new URL("/x/comment", caterpillarSettings.apiURL);

    let r = await fetch(API.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(inputs),
    });

    if (r.status === 201) {
      window.location.reload();
    }
  };

  return (
    <div class={tw`text-center`}>
      <form onSubmit={handleSubmit}>
        <textarea
          name="content"
          rows="3"
          cols="63"
          value={inputs.content || ""}
          onChange={handleChange}
          placeholder="Reply"
          class={tw`bg-gray-100 my-2 mx-2 rounded-md p-2`}
        />
        <br />
        <input
          type="submit"
          class={tw`rounded-md bg-white p-2 shadow-md hover:bg-gray-100`}
        />
      </form>
    </div>
  );
}
