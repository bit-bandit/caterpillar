import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";

export default function UpdateTorrent(props: any) {
  const [torrentData, setTD] = useState({});
  const [isUser, setUser] = useState("");
  const [inputs, setInputs] = useState({});

  useEffect(async () => {
    let token = await caches.open("parasite");
    token = await token.match("/login");

    if (token === undefined) {
      window.location.href = "/login";
    }

    token = await token.text();

    const torrentURL = new URL(
      window.location.href.split("update")[1],
      caterpillarSettings.apiURL,
    );
    let torrentD = await fetch(torrentURL.href);
    torrentD = await torrentD.json();

    const reg = /<p>(.*)<\/p>/;

    // TODO: Replace this with something that isn't complete dogshit
    if (
      typeof torrentD.content === "string" && reg.test(torrentD.content)
    ) {
      torrentD.content = reg.exec(torrentD.content)[1];
    }

    setTD(torrentD);

    const checkURL = new URL("/u", caterpillarSettings.apiURL);
    let user = await fetch(checkURL.href, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });
    user = await user.json();
    setUser(user.id === torrentD.attributedTo);

    let tags = "";

    torrentD.tag.map((x) => {
      x = (new URL(x)).pathname;
      x = x.split("/")[2];
      tags += `${x},`;
    });

    setInputs({
      name: torrentD.name,
      href: torrentD.attachment.href,
      tags: tags,
      content: torrentD.content,
    });
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let token = await caches.open("parasite");
    token = await token.match("/login");
    token = await token.text();

    inputs.type = "Update";

    const torrentURL = new URL(
      window.location.href.split("update")[1],
      caterpillarSettings.apiURL,
    );

    let r = await fetch(torrentURL.href, {
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
            placeholder="Title of torrent"
            onChange={handleChange}
            class="bg-gray-100 my-2 mx-2 rounded-md p-2"
          />
          <br />
          <input
            type="text"
            size="60px"
            name="href"
            value={inputs.href || ""}
            placeholder="Torrent magnet link"
            onChange={handleChange}
            class="bg-gray-100 my-2 mx-2 rounded-md p-2"
          />
          <br />
          <input
            type="text"
            size="60px"
            name="tags"
            value={inputs.tags || ""}
            placeholder="Torrent tags (Seperate by commas - IE 'tag1,tag2,tag3')"
            onChange={handleChange}
            class="bg-gray-100 my-2 mx-2 rounded-md p-2"
          />
          <br />
          <textarea
            name="content"
            rows="6"
            cols="63"
            value={inputs.content || ""}
            onChange={handleChange}
            placeholder="Add information about the torrent."
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
