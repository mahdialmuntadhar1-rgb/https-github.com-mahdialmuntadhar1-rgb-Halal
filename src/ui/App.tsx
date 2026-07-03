import { useState, useEffect } from "react";
import { AuthService } from "../app/services/AuthService";

export default function App() {
  const [user, setUser] = useState(AuthService.getUser());

  useEffect(() => {
    setUser(AuthService.getUser());
  }, []);

  if (!user) {
    return (
      <div>
        <h2>Login Required</h2>
        <button
          onClick={() => {
            const u = AuthService.login({ id: 1, name: "Demo User" });
            setUser(u);
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
          AuthService.logout();
          setUser(null);
        }}
      >
        Logout
      </button>
    </div>
  );
}
