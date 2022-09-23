import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";

// TODO: Change H4 headers to be links to respective objects

// API:
// <Subcomp
//  APIObject={objectDerivedFromAPI}
//  />

export function Subcomp(props: unknown) {
  // A lot of this should probably be minimized...
  if (props.APIObject.type !== "Note") {
    return (
      <div class="max-h-26 m-3 flex rounded-2xl p-3 shadow-md bg-gray-100">
        <img class="w-7" src="/list.svg" />
        <h4 class="mx-3 text-xl font-bold">
          <a href={props.APIObject.url} class="hover:underline">
            {props.APIObject.name}
          </a>
        </h4>
        <p>({props.APIObject.totalItems} items)</p>
        <div class="mx-4 flex">
          <div class="text-green-700">+{props.APIObject.dislikes}</div>
          <div>/</div>
          <div class="text-red-700">-{props.APIObject.dislikes}</div>
        </div>
      </div>
    );
  }
  return (
    <div class="max-h-26 m-3 flex rounded-2xl p-3 shadow-md bg-gray-100">
      <img class="w-7" src="/magnet.svg" />
      <h4 class="mx-3 text-xl font-bold">
        <a href={props.APIObject.url} class="hover:underline">
          {props.APIObject.name}
        </a>
      </h4>
      <div class="mx-1 flex">
        <div class="text-green-700">+{props.APIObject.likes}</div>
        <div>/</div>
        <div class="text-red-700">-{props.APIObject.dislikes}</div>
      </div>
    </div>
  );
}
