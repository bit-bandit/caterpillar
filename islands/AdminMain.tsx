/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { caterpillarSettings } from "../settings.ts";

import AdminRoutes from "../components/AdminRoutes.tsx";

export default function AdminMain(props: any) {
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
    return (
      <div class={tw`flex max-w-2xl`}>
        <AdminRoutes />
        <div class={tw`rounded-md shadow-md bg-white p-3`}>
          <p>Welcome to the admin dashboard. From here you can:</p>
          <div>
            <ul class={tw`list-disc pl-5`}>
              <li>Assign Roles to users on this instance.</li>
              <li>Control which federated instances are pooled, or blocked.</li>
              <li>Remove torrents, lists, and comments.</li>
            </ul>
          </div>
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
