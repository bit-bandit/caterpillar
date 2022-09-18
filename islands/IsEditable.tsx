import { useEffect, useState } from "preact/hooks";

// <IsEditable uid={id}/>
export default function isEditable(props: any) {
  let [usr, setUsr] = useState({ err: true, msg: "Users not equal." });

  const onUpdate = () => {
    let c = `/update${new URL(window.location.href).pathname}`;
    window.location.href = c;
  };

  useEffect(async () => {
    const c = await caches.open("parasite");
    let user = await c.match("/u");

    if (user) {
      setUsr(await user.json());
    }
  }, []);

  if (usr.id === props.uid) {
    console.log("aa");
    return (
      <div>
        <button class="w-6 flex mx-3" onclick={onUpdate}>
          <img src="/pencil.svg" />
        </button>
      </div>
    );
  }

  return <div></div>;
}
