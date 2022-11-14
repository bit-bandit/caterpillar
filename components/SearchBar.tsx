import { IS_BROWSER } from "$fresh/runtime.ts";

export function SearchBar() {
  return (
    <div class="flex m-3">
      <form action="/s" method="GET" class="flex">
        <input
          type="text"
          name="q"
          class="mx-3 rounded-2xl bg-white p-2 shadow-md"
          placeholder="Search"
        />
        <button type="submit" id="search">
          <img
            class="w-12 rounded-full bg-white p-3 text-gray-500 shadow-md hover:bg-gray-100 hover:shadow-lg"
            src="/search.svg"
            alt="Search for results"
          />
        </button>
      </form>
    </div>
  );
}

export function SmallSearchBar(props: {
  str?: string;
}) {
  return (
    <div class="flex">
      <form action="/s" method="GET" class="flex">
        <input
          type="text"
          name="q"
          class="ml-3 mr-2 rounded-2xl bg-white px-2 max-h-9 shadow-md"
          placeholder="Search"
          value={props.str}
        />
        <button type="submit" id="search">
          <img
            class="w-9 rounded-full bg-white p-2 text-gray-500 shadow-md hover:bg-gray-100 hover:shadow-lg"
            src="/search.svg"
            alt="Search for results"
          />
        </button>
      </form>
    </div>
  );
}
