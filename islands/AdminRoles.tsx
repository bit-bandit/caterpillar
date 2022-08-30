/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { caterpillarSettings } from "../settings.ts";

import AdminRoutes from "../components/AdminRoutes.tsx";

// Here be dragons.

export default function AdminRoles(props: any) {
  let [i, setI] = useState({ "undefined": true });

  useEffect(async () => {
    let token = await caches.open("parasite");
    token = await token.match("/login");

    if (token === undefined) {
      setI({
        "err": true,
        "msg": "No token found",
      });
      return;
    }

    token = await token.text();

    const aURL = new URL("/a", caterpillarSettings.apiURL);

    const res = await fetch(aURL.href, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });
    setI(await res.json());
  }, []);

  if (i.msg && !i.err) {
    let aURL = new URL("/a/roles", caterpillarSettings.apiURL);

    let [res, setRes] = useState({});
    useEffect(async () => {
      let token = await caches.open("parasite");
      token = await token.match("/login");

      token = await token.text();

      let a = await fetch(aURL.href, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });
      setRes(await a.json());
    }, []);

    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      const u = new URL("/a/reassign", caterpillarSettings.apiURL);

      let token = await caches.open("parasite");
      token = await token.match("/login");

      token = await token.text();

      let res = await fetch(u.href, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(inputs),
      });

      res = await res.json();

      if (res.err) {
        alert(`Error: ${res.msg}`);
      } else {
        alert(res.msg);
      }
    };

    return (
      <div class={tw`flex max-w-xl`}>
        <AdminRoutes />
        <div class={tw`rounded-md shadow-md bg-white p-2`}>
          <h1 class={tw`text-2xl m-2 font-bold`}>Reassign roles</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Username: <br />
              <input
                type="text"
                name="id"
                value={inputs.id || ""}
                onChange={handleChange}
                class={tw`bg-gray-100 my-2 mx-2 rounded-md p-2`}
              />
            </label>
            <br />
            <label>
              Role: <br />
              <input
                type="text"
                name="role"
                value={inputs.role || ""}
                onChange={handleChange}
                class={tw`bg-gray-100 my-2 mx-2 rounded-md p-2`}
              />
            </label>
            <br />
            <input
              type="submit"
              class={tw`bg-white p-2 shadow-md rounded-md hover:bg-gray-100`}
            />
          </form>
          <br />
          <h1 class={tw`text-2xl m-2 font-bold`}>Available roles</h1>
          <pre class={tw`p-2 m-2 bg-gray-100`}>
	  {JSON.stringify(res, null, "  ")}
          </pre>
        </div>
      </div>
    );
  }

  if (i.err) {
    return (
      <div>
        <p>Not permitted</p>
      </div>
    );
  }

  if (i.undefined) {
    return (
      <div>
        <div class="p-5 w-5 rounded-full bg-gray-100" />
      </div>
    );
  }
}
