import { IS_BROWSER } from "$fresh/runtime.ts";
export default function Footer() {
  return (
    <footer class="border-t-2 border-gray-200 bg-gray-100 h-32 flex flex-col justify-center">
      <div>
        <p>Powered by PARASITE.</p>
      </div>
    </footer>
  );
}
