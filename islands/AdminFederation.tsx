/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { caterpillarSettings } from "../settings.ts";

import AdminRoutes from "../components/AdminRoutes.tsx";

export default function AdminFederation() {
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
  const [inputs, setInputs] = useState({});
  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      console.log(inputs);

      let token = await caches.open("parasite");
      token = await token.match("/login");
      token = await token.text();

      console.log(token);

      let r = await fetch((new URL("/a/federate", caterpillarSettings.apiURL)).href, {
      	  method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
      	  body: JSON.stringify(inputs)
      });

      r = await r.json();

      if (r.err) {
      	alert(r.msg); 
      } else {
      	window.location.reload();
      }
  }

  return (
    <div class={tw`flex max-w-xl`}>
    <AdminRoutes />
    <div class={tw`rounded-md shadow-md bg-white p-2`}>
      <h1 class={tw`mb-8 text-4xl font-bold`}>Federation options</h1>
      <form onSubmit={handleSubmit}>
        <label>
          ID: <br />
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
          Option: <br />
          <select name="type" value={inputs.type} onChange={handleChange} class={tw`w-64 m-2 rounded-md p-2`}>
            <option value="Pool">Pool</option>
            <option value="Unpool">Unpool</option>
            <option value="Block">Block</option>
            <option value="Unblock">Unblock</option>
          </select>
        </label>
        <br />
	<label>
          Range: <br />
          <select name="range" value={inputs.range} onChange={handleChange} class={tw`w-64 m-2 rounded-md p-2`}>
            <option value="Instance">Instance</option>
            <option value="User">User</option>
          </select>
        </label>
        <br />
        <input
          type="submit"
          class={tw`bg-white p-2 shadow-md rounded-md hover:bg-gray-100`}
        />
      </form>
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
