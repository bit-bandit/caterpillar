import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../settings.ts";
import { useEffect, useState } from "preact/hooks";

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

    if (!props.href) {
      inputs.inReplyTo = (new URL(
        (new URL(window.location.href)).pathname,
        caterpillarSettings.apiURL,
      )).href;
    } else {
      // Doing this in case some asshole tries to fuck w/ incoming data.
      inputs.inReplyTo = (new URL(props.href)).href;
    }

    let token = await caches.open("parasite");
    token = await token.match("/login");

    if (token === undefined) {
      window.location.href = "/login";
    }

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
    <div class="text-center">
      <form onSubmit={handleSubmit}>
        <input
          value={inputs.content || ""}
          onChange={handleChange}
          name="content"
          placeholder="Reply"
          class="my-2 mx-2 rounded-md bg-gray-100 p-2 w-96"
        />
        <input
          type="submit"
          class={`rounded-md bg-white p-2 shadow-md hover:bg-gray-100`}
        />
      </form>
    </div>
  );
}
