import { PageProps } from "$fresh/server.ts";
// TODO: Add types to this.
export function ListItemTorrent(props: any) {
  const d = new Date(props.date);
  return (
    <div class="max-w-screen-md max-h-26 m-4 flex rounded-2xl p-4 shadow-md bg-white">
      <div class="w-24 h-24 p-5 rounded-full bg-gray-200">
        <img class="w-24" src="/magnet.svg" />
      </div>
      <div>
        <div class="mx-4 my-2 text-3xl font-bold hover:underline">
          <a href={props.href}>{props.name}</a>
        </div>
        <div class="flex">
          <div class="w-6 mx-3">
            <img class="rounded-full shadow-md" src={props.icon} />
          </div>
          <div class="font-bold hover:underline">
            <a href={props.uploaderHref}>{props.uploader}</a>
          </div>
          <p class="mx-2">-</p>
          <div class="italic text-slate-500">{d.toLocaleString()}</div>
          <p class="mx-2">-</p>
          <div class="hover:underline">
            <a href={props.magnet}>Download</a>
          </div>
          <p class="mx-2">-</p>
          <div class="flex">
            <div class="text-green-700">+{props.likes}</div>
            <div>/</div>
            <div class="text-red-700">-{props.dislikes}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
