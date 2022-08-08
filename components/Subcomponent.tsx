/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { caterpillarSettings } from "../settings.ts";

// TODO: Change H4 headers to be links to respective objects

// API:
// <Subcomp
//  APIObject={objectDerivedFromAPI}
//  Likes={likes.length}
//  Dislikes={dislikes.length}
//  />

export function Subcomp(props: any) {
  // A lot of this should probably be minimized...
  if (props.APIObject.type !== "Note") {
    return (
      <div class={tw`max-h-26 m-3 flex rounded-2xl p-3 shadow-md bg-gray-100`}>
        <img class={tw`w-7`} src="/list.svg" />
        <h4 class={tw`mx-3 text-xl font-bold`}>
          <a href={props.APIObject.url} class={tw`hover:underline`}>
            {props.APIObject.name}
          </a>
        </h4>
        <p>({props.APIObject.totalItems} items)</p>
        <div class={tw`mx-4 flex`}>
          <div class={tw`text-green-700`}>+{props.APIObject.dislikes}</div>
          <div>/</div>
          <div class={tw`text-red-700`}>-{props.APIObject.dislikes}</div>
        </div>
      </div>
    );
  }
  return (
    <div class={tw`max-h-26 m-3 flex rounded-2xl p-3 shadow-md bg-gray-100`}>
      <img class={tw`w-7`} src="/magnet.svg" />
      <h4 class={tw`mx-3 text-xl font-bold`}>
        <a href={props.APIObject.url} class={tw`hover:underline`}>
          {props.APIObject.name}
        </a>
      </h4>
      <div class={tw`mx-1 flex`}>
        <div class={tw`text-green-700`}>+{props.APIObject.likes}</div>
        <div>/</div>
        <div class={tw`text-red-700`}>-{props.APIObject.dislikes}</div>
      </div>
    </div>
  );
}
