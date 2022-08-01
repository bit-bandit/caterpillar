/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";

export default function Greet(props: PageProps) {
  // This, my dear friends, is the pathname. Look at it, for it is beautiful.
  console.log(props.url.pathname)
  return <div>So you're looking for a torrent with the ID of {props.params.id}...</div>;
}
