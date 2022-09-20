import { createRef } from "preact";
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";

export default function UpdateProfile() {
  let [torrentData, setTD] = useState({});
  let [isUser, setUser] = useState("");
  let [inputs, setInputs] = useState({});

  useEffect(async () => {
    let token = await caches.open("parasite");
    token = await token.match("/login");

    if (token === undefined) {
      window.location.href = "/login";
    }

    token = await token.text();

    const userURL = new URL(
      window.location.href.split("update")[1],
      caterpillarSettings.apiURL,
    );
    let userD = await fetch(userURL.href);
    userD = await userD.json();

    const checkURL = new URL("/u", caterpillarSettings.apiURL);

    let currentUser = await fetch(checkURL.href, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    currentUser = await currentUser.json();

    setUser(currentUser.id === userD.id);

    setInputs({
      name: userD.name,
      summary: userD.summary,
    });
  }, []);

  if (isUser === "") {
    return (
      <div>
        <div class="p-5 w-5 rounded-full bg-gray-100" />
      </div>
    );
  }

  if (!isUser) {
    return (
      <div>
        <h1>Not permitted</h1>
      </div>
    );
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const icon = createRef();
  const banner = createRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (icon.current.files[0]) {
      inputs.icon = Array.from(
        new Uint8Array(await icon.current.files[0].arrayBuffer()),
      );
    }

    if (banner.current.files[0]) {
      inputs.banner = Array.from(
        new Uint8Array(await banner.current.files[0].arrayBuffer()),
      );
    }

    let token = await caches.open("parasite");
    token = await token.match("/login");
    token = await token.text();

    const userURL = new URL(
      window.location.href.split("update")[1],
      caterpillarSettings.apiURL,
    );

    let r = await fetch(userURL.href, {
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

    console.log(inputs);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          size="60px"
          name="name"
          value={inputs.name || ""}
          placeholder="User name"
          onChange={handleChange}
          class="bg-gray-100 my-2 mx-2 rounded-md p-2"
        />
        <br />
        <input
          type="text"
          size="60px"
          name="summary"
          value={inputs.summary || ""}
          placeholder="User summary"
          onChange={handleChange}
          class="bg-gray-100 my-2 mx-2 rounded-md p-2"
        />
        <br />
        <label>Icon file:</label>
        <input
          type="file"
          name="icon"
          ref={icon}
          class="bg-gray-100 my-2 mx-2 rounded-md p-2"
          accept="image/png, image/jpeg, image/jpg"
        />
        <br />
        <label>Banner file:</label>
        <input
          type="file"
          name="banner"
          ref={banner}
          class="bg-gray-100 my-2 mx-2 rounded-md p-2"
          accept="image/png, image/jpeg, image/jpg"
        />
        <br />
        <input
          type="submit"
          class="rounded-md bg-white p-2 rounded-2xl shadow-md hover:bg-gray-100"
        />
      </form>
    </div>
  );
}
