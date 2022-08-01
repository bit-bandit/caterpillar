/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";

export default function Greet(props: PageProps) {
  return <div>So you're looking for a list with the ID of {props.params.id}...</div>;
}
