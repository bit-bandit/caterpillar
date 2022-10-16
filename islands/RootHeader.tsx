// Modified header for the `/` endpoint.
import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";
import UserBox from "./UserBox.tsx";
import { SmallSearchBar } from "../components/SearchBar.tsx";

export default function RootHeader() {
  return (
    <div class="px-5 mt-3 justify-around items-center flex">
      <div>
      </div>
      <div>
      </div>
      <div class="flex items-center">
        <div class="relative">
          <details>
            <summary
              class="list-none mr-4 text-3xl text-center font-bold hover:bg-gray-200 items-center w-9 rounded-full"
              title="Upload"
            >
              +
            </summary>
            <div class="absolute shadow-lg w-32 right-2.5 bg-white py-3 text-center">
              <a href="/upload/torrent">
                <div class="flex items-center hover:bg-gray-200 px-4 text">
                  <img src="/magnet.svg" class="w-8 p-2" />
                  Torrent
                </div>
              </a>
              <a href="/upload/list">
                <div class="flex items-center hover:bg-gray-200 px-4 text">
                  <img src="/list.svg" class="w-8 p-2" />
                  List
                </div>
              </a>
            </div>
          </details>
        </div>
        <UserBox />
      </div>
    </div>
  );
}
