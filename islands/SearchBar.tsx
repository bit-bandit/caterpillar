/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useRef } from "preact/hooks";

export default function SearchBar() {
  const input = useRef();

  const searchInput = () => {
    const x = new URL(`/s?q=${input.current.value}`, window.location.href);
    window.location.href = x.href;
  };

  return (
    <div class={tw`flex m-3`}>
      <input
        ref={input}
        class={tw`mx-3 rounded-2xl bg-white p-2 shadow-md`}
        placeholder="Search"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            searchInput();
          }
        }}
      />
      <button onClick={searchInput}>
        <svg
          class={tw`w-12 rounded-full bg-white p-3 text-gray-500 shadow-md hover:bg-gray-100 hover:shadow-lg`}
          xmlns:svg="http://www.w3.org/2000/svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -256 1792 1792"
          id="svg3025"
          version="1.1"
          width="100%"
          height="100%"
          sodipodi:docname="search_font_awesome.svg"
        >
          <g transform="matrix(1,0,0,-1,60.745763,1201.8983)" id="g3027">
            <path
              d="m 1152,704 q 0,185 -131.5,316.5 Q 889,1152 704,1152 519,1152 387.5,1020.5 256,889 256,704 256,519 387.5,387.5 519,256 704,256 889,256 1020.5,387.5 1152,519 1152,704 z m 512,-832 q 0,-52 -38,-90 -38,-38 -90,-38 -54,0 -90,38 L 1103,124 Q 924,0 704,0 561,0 430.5,55.5 300,111 205.5,205.5 111,300 55.5,430.5 0,561 0,704 q 0,143 55.5,273.5 55.5,130.5 150,225 94.5,94.5 225,150 130.5,55.5 273.5,55.5 143,0 273.5,-55.5 130.5,-55.5 225,-150 94.5,-94.5 150,-225 Q 1408,847 1408,704 1408,484 1284,305 l 343,-343 q 37,-37 37,-90 z"
              id="path3029"
              inkscape:connector-curvature="0"
              style="fill:currentColor"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}

export function SmallSearchBar() {
  const input = useRef();

  const searchInput = () => {
    const x = new URL(`/s?q=${input.current.value}`, window.location.href);
    window.location.href = x.href;
  };

  return (
    <div class={tw`flex`}>
      <input
        ref={input}
        class={tw`ml-3 mr-2 rounded-2xl bg-white px-2 max-h-9 shadow-md`}
        placeholder="Search"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            searchInput();
          }
        }}
      />
      <button onClick={searchInput}>
        <svg
          class={tw`w-9 mr-3 rounded-full bg-white p-2 text-gray-500 shadow-md hover:bg-gray-100 hover:shadow-lg`}
          xmlns:svg="http://www.w3.org/2000/svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -256 1792 1792"
          id="svg3025"
          version="1.1"
          width="100%"
          height="100%"
          sodipodi:docname="search_font_awesome.svg"
        >
          <g transform="matrix(1,0,0,-1,60.745763,1201.8983)" id="g3027">
            <path
              d="m 1152,704 q 0,185 -131.5,316.5 Q 889,1152 704,1152 519,1152 387.5,1020.5 256,889 256,704 256,519 387.5,387.5 519,256 704,256 889,256 1020.5,387.5 1152,519 1152,704 z m 512,-832 q 0,-52 -38,-90 -38,-38 -90,-38 -54,0 -90,38 L 1103,124 Q 924,0 704,0 561,0 430.5,55.5 300,111 205.5,205.5 111,300 55.5,430.5 0,561 0,704 q 0,143 55.5,273.5 55.5,130.5 150,225 94.5,94.5 225,150 130.5,55.5 273.5,55.5 143,0 273.5,-55.5 130.5,-55.5 225,-150 94.5,-94.5 150,-225 Q 1408,847 1408,704 1408,484 1284,305 l 343,-343 q 37,-37 37,-90 z"
              id="path3029"
              inkscape:connector-curvature="0"
              style="fill:currentColor"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}
