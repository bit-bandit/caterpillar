import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";

export default function FederatedInstances() {
  let [info, setInfo] = useState({
    pooledInstances: [],
    blockedInstances: [],
  });

  useEffect(async () => {
    let rawDataFetch = await fetch(caterpillarSettings.apiURL, {
      headers: {
        Accept: "application/json",
      },
    });
    rawDataFetch = await rawDataFetch.json();
    setInfo(rawDataFetch);
  }, []);

  return (
    <div class="flex">
      <div class="rounded-md shadow-md p-2 m-2 w-60">
        <h3 class="font-bold text-2xl">Pooled</h3>
        {info.pooledInstances.map((x) => {
          return (
            <a href={x}>
              <pre>
	   {x}
              </pre>
            </a>
          );
        })}
      </div>
      <div class="rounded-md shadow-md p-2 m-2 w-60">
        <h3 class="font-bold text-2xl">Blocked</h3>
        {info.blockedInstances.map((x) => {
          return (
            <a href={x}>
              <pre>
	   {x}
              </pre>
            </a>
          );
        })}
      </div>
    </div>
  );
}
