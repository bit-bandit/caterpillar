/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Counter from "../islands/Counter.tsx";

// <Counter start={3} />

export default function Home() {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <div class={tw`my-6`}>
	<h1>Catepiller</h1>
	<p>
          start adding torrents here.
        </p>
      </div>
    </div>
  );
}
