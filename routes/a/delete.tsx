import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import AdminRemove from "../../islands/AdminRemove.tsx";
import Header from "../../islands/Header.tsx";

// <AdminMain />
// <Header />
export default function Index(props: PageProps) {
  return (
    <div>
      <div class="mx-auto max-w-screen-xl">
        <AdminRemove />
        <a href="/" class="hover:underline text-blue-800 mx-5">🡐 Back</a>
      </div>
    </div>
  );
}
