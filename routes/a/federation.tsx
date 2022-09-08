import { Handlers, PageProps } from "$fresh/server.ts";
import { caterpillarSettings } from "../../settings.ts";
import AdminFederation from "../../islands/AdminFederation.tsx";
import Header from "../../islands/Header.tsx";

// <AdminMain />
// <Header />
export default function Index(props: PageProps) {
  return (
    <div>
      <div class="mx-auto max-w-screen-xl">
        <AdminFederation />
        <a href="/" class="hover:underline text-blue-800 mx-5">🡐 Back</a>
      </div>
    </div>
  );
}
