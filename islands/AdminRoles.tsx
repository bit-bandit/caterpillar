/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { caterpillarSettings } from "../settings.ts";

import AdminRoutes from "../components/AdminRoutes.tsx";

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

    return (
      <div class={tw`flex max-w-xl`}>
        <AdminRoutes />
        <div class={tw`rounded-md shadow-md bg-white p-2`}>
          <pre>
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
        <p>Wait for me</p>
      </div>
    );
  }
}
