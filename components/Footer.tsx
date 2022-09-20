import { IS_BROWSER } from "$fresh/runtime.ts";
export default function Footer() {
  return (
    <footer class="bg-gray-100 h-32 flex flex-col justify-center">
      <div class="mx-11 text-lg">
        <a href="https://github.com/bit-bandit/parasite">
          <p class="text-right hover:underline">Powered by Parasite</p>
        </a>
      </div>
    </footer>
  );
}
