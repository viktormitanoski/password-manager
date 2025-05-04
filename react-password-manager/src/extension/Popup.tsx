import { useState } from "react";

export default function Popup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ width: 300, padding: 16 }}>
      <h5>🔐 Save Credentials</h5>
      <input
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="form-control mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-primary w-100">Save</button>
    </div>
  );
}
