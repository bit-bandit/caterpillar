import { useEffect, useState } from "preact/hooks";

// <IsEditable uid={id}/>
export default function isEditable(props: any) {
  const [usr, setUsr] = useState({ err: true, msg: "Users not equal." });

  const onUpdate = () => {
    window.location.href = `/update${new URL(window.location.href).pathname}`;
  };

  useEffect(async () => {
    const c = await caches.open("parasite");
    const user = await c.match("/u");

    if (user) {
      setUsr(await user.json());
    }
  }, []);

  if (usr.id === props.uid) {
    return (
      <div>
        <button
          class="w-10 flex mx-3 p-2 hover:bg-gray-200 rounded-full"
          onclick={onUpdate}
          title="Update"
        >
          <img src="/pencil.svg" />
        </button>
      </div>
    );
  }

  return <div></div>;
}
