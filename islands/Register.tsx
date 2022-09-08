import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { caterpillarSettings } from "../settings.ts";

export default function RegistrationForm() {
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const u = new URL("/register", caterpillarSettings.apiURL);

    const res = await fetch(u.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });

    if (res.status === 201) {
      const a = new URL("/login", window.location.href);
      window.location.href = a.href;
    }
  };

  return (
    <div class="p-5 mx-auto max-w-screen-md text-center">
      <h1 class="mb-8 text-4xl font-bold">Register</h1>
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
    </div>
  );
}
