export function ListItemTorrent(props: {
  date: string;
  href: string;
  name: string;
  icon: string;
  uploaderHref: string;
  uploader: string;
  magnet: string;
  likes: number;
  dislikes: number;
}) {
  const d = new Date(props.date);
  const u = new URL(props.uploaderHref);
  const formattedUsername = `@${u.pathname.split("/")[2]}@${u.host}`;

  return (
    <div class="max-w-screen-md max-h-26 m-4 flex rounded-2xl p-4 shadow-md bg-white">
      <div class="w-24 h-24 p-5 rounded-full bg-gray-200">
        <img class="w-24 h-14" src="/magnet.svg" />
      </div>
      <div>
        <div class="mx-4 my-2 text-3xl font-bold hover:underline truncate">
          <a href={props.href}>{props.name}</a>
        </div>
        <div class="flex">
          <div class="w-6 ml-3">
            <img class="rounded-full shadow-md" src={props.icon} />
          </div>
          <a href={props.uploaderHref}>
            <div class="flex">
              <div class="pl-2 font-bold">{props.uploader}</div>
              <p class="text-xs place-self-center px-1 text-gray-600">
                {formattedUsername}
              </p>
            </div>
          </a>
          <p class="mx-2">-</p>
          <div class="text-slate-500">{d.toLocaleDateString()}</div>
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
