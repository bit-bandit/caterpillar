import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";

export default function LoginForm() {
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const u = new URL("/login", caterpillarSettings.apiURL);

    const res = await fetch(u.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });

    // Ensures that no errors are written to the cache
    if (res.status === 200) {
      const c = await caches.open("parasite");
      await c.put("/login", res);

      const checkURL = new URL(
        `/u/${inputs.username}`,
        caterpillarSettings.apiURL,
      );

      const r = await fetch(checkURL.href, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (r.status === 200) {
        await c.put("/u", r);
      }

      window.location.href = "/";
    } else {
      const c = await res.json();
      if (c.msg === "Not permitted to login") {
        window.location.href = "https://www.youtube.com/watch?v=FXPKJUE86d0";
      } else {
        alert(c.msg);
      }
    }
  };

  return (
    <div class="p-5 mx-auto max-w-screen-md text-center">
      <h1 class="mb-8 text-4xl font-bold">Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username: <br />
          <input
            type="text"
            name="username"
            value={inputs.username || ""}
            onChange={handleChange}
            class="bg-gray-100 my-2 mx-2 rounded-md p-2"
          />
        </label>
        <br />
        <label>
          Password: <br />
          <input
            type="password"
            name="password"
            value={inputs.password || ""}
            onChange={handleChange}
            class="bg-gray-100 my-2 mx-2 rounded-md p-2"
          />
        </label>
        <br />
        <input
          type="submit"
          class="bg-white p-2 shadow-md rounded-md hover:bg-gray-100"
        />
      </form>
      <br />
      <p>
        Don't have an account?{" "}
        <a href="/register" class="underline -bold">Register.</a>
      </p>
    </div>
  );
}
