import { useState } from "react";
import { EngineClient } from "./engine";

export default function App() {
  const [user, setUser] = useState(EngineClient.auth?.getUser?.());

  if (!user) {
    return (
      <div>
        <h2>Login Required</h2>
        <button
          onClick={() => {
            const fakeUser = { id: 1, name: "Demo User" };
            EngineClient.auth?.login(fakeUser);
            setUser(fakeUser);
          }}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <button
        onClick={() => {
          EngineClient.auth?.logout();
          setUser(null);
        }}
      >
        Logout
      </button>
    </div>
  );
}
