import React, { useState } from "react";

function BankIDLogin() {
  const [pnr, setPnr] = useState("");
  const [status, setStatus] = useState(null);
  const [orderRef, setOrderRef] = useState(null);

  const startAuth = async () => {
    setStatus("Starting authentication...");
    const res = await fetch("/api/bankid/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personalNumber: pnr })
    });
    const data = await res.json();
    setOrderRef(data.orderRef);

    // Launch BankID app (for same-device auth)
    if (data.autoStartToken) {
      window.location.href = `bankid:///?autostarttoken=${data.autoStartToken}`;
    }

    pollStatus(data.orderRef);
  };

  const pollStatus = async (ref) => {
    let done = false;
    while (!done) {
      const res = await fetch(`/api/bankid/collect/${ref}`);
      const data = await res.json();
      setStatus(`Status: ${data.status}`);

      if (data.status === "complete") {
        setStatus(`✅ Authenticated as ${data.completionData.user.name}`);
        done = true;
      } else if (data.status === "failed") {
        setStatus("❌ Authentication failed");
        done = true;
      } else {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">BankID Login</h1>
      <input
        type="text"
        placeholder="YYYYMMDDNNNN"
        value={pnr}
        onChange={e => setPnr(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={startAuth} className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
      <p className="mt-4">{status}</p>
    </div>
  );
}

export default BankIDLogin;
