import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";

export default function Logout() {
  useEffect(async () => {
    const c = await caches.open("parasite");
    await c.delete("/login");
    await c.delete("/u");
    window.location.href = "/";
  });

  return (
    <div class="p-5 mx-auto max-w-screen-md text-center">
      Logging you out...
    </div>
  );
}
