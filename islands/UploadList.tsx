/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../settings.ts";
import { useEffect, useState } from "preact/hooks";
import { tw } from "@twind";

export default function UploadList(props: any) {
  let [inputs, setInputs] = useState({});

  useEffect(async () => {
    let res = await caches.open("parasite");
    res = await res.match("/login");

    if (res === undefined) {
      window.location.href = "/login";
    }
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    inputs.type = "Create";
    inputs.orderedItems = inputs.orderedItems.split(/[\,\n\. ]+/);

    let token = await caches.open("parasite");
    token = await token.match("/login");
    token = await token.text();

    const API = new URL("/l/", caterpillarSettings.apiURL);

    let r = await fetch(API.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(inputs),
    });

    if (r.status === 201) {
      // This sucks, but I can't get the `location` header back from the response.
      r = await r.json();
      r = r.msg.split(" ").pop();
      window.location.href = (new URL(r)).pathname;
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          size="60px"
          name="name"
          value={inputs.name || ""}
          placeholder="Title of torrent"
          onChange={handleChange}
          class={tw`bg-gray-100 my-2 mx-2 rounded-md p-2`}
        />
        <br />
        <input
          type="text"
          size="60px"
          name="tags"
          value={inputs.tags || ""}
          placeholder="List tags (Seperate by commas - IE 'tag1,tag2,tag3')"
          onChange={handleChange}
          class={tw`bg-gray-100 my-2 mx-2 rounded-md p-2`}
        />
        <br />
        <textarea
          name="summary"
          rows="3"
          cols="63"
          value={inputs.summary || ""}
          onChange={handleChange}
          placeholder="Add information about the list."
          class={tw`bg-gray-100 my-2 mx-2 rounded-md p-2`}
        />
        <textarea
          name="orderedItems"
          rows="5"
          cols="63"
          value={inputs.orderedItems || ""}
          onChange={handleChange}
          placeholder="URLs of items you want to include in the list."
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
