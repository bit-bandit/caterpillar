import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";

export default function UpdateList() {
  const [listData, setLD] = useState({});
  const [isUser, setUser] = useState("");
  const [inputs, setInputs] = useState({});

  useEffect(async () => {
    let token = await caches.open("parasite");
    token = await token.match("/login");

    if (token === undefined) {
      window.location.href = "/login";
    }

    token = await token.text();

    const listURL = new URL(
      window.location.href.split("update")[1],
      caterpillarSettings.apiURL,
    );

    let listD = await fetch(listURL.href);
    listD = await listD.json();

    const reg = /<p>(.*)<\/p>/;

    // TODO: Replace this with something that isn't complete dogshit
    if (
      typeof listD.summary === "string" && reg.test(listD.summary)
    ) {
      listD.summary = reg.exec(listD.summary)[1];
    }

    setLD(listD);

    const checkURL = new URL("/u", caterpillarSettings.apiURL);
    let user = await fetch(checkURL.href, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });
    user = await user.json();
    setUser(user.id === listD.attributedTo);

    let tags = "";

    listD.tag.map((x) => {
      x = (new URL(x)).pathname;
      x = x.split("/")[2];
      tags += `${x},`;
    });

    setInputs({
      name: listD.name,
      summary: listD.summary,
      tags: tags,
      orderedItems: listD.orderedItems.join("\n"),
    });
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    inputs.orderedItems = inputs.orderedItems.split(/[\,\n\. ]+/);

    let token = await caches.open("parasite");
    token = await token.match("/login");
    token = await token.text();

    inputs.type = "Update";

    const listURL = new URL(
      window.location.href.split("update")[1],
      caterpillarSettings.apiURL,
    );

    let r = await fetch(listURL.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(inputs),
    });
    r = await r.json();
    if (!r.err) {
      alert("Update successful");
      window.location.href = window.location.href.split("update")[1];
    } else {
      alert(res.err);
    }
  };

  if (isUser === "") {
    return (
      <div>
        <div class="p-5 w-5 rounded-full bg-gray-100" />
      </div>
    );
  }

  if (typeof isUser === "string") {
    return (
      <div>
        <div class="p-5 w-5 rounded-full bg-gray-100" />
      </div>
    );
  }

  if (isUser) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            size="60px"
            name="name"
            value={inputs.name || ""}
            placeholder="Title of list"
            onChange={handleChange}
            class="bg-gray-100 my-2 mx-2 rounded-md p-2"
          />
          <br />
          <input
            type="text"
            size="60px"
            name="tags"
            value={inputs.tags || ""}
            placeholder="List tags (Seperate by commas - IE 'tag1,tag2,tag3')"
            onChange={handleChange}
            class="bg-gray-100 my-2 mx-2 rounded-md p-2"
          />
          <br />
          <textarea
            name="summary"
            rows="3"
            cols="60"
            value={inputs.summary || ""}
            onChange={handleChange}
            placeholder="Add information about the list."
            class="bg-gray-100 my-2 mx-2 rounded-md p-2"
          />
          <textarea
            name="orderedItems"
            rows="5"
            cols="60"
            value={inputs.orderedItems || ""}
            onChange={handleChange}
            placeholder="URLs of items you want to include in the list."
            class="bg-gray-100 my-2 mx-2 rounded-md p-2"
          />
          <br />
          <input
            type="submit"
            class="rounded-md bg-white p-2 shadow-md hover:bg-gray-100"
          />
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Not permitted</h1>
      </div>
    );
  }
}
