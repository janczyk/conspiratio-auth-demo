import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

// Konfiguracja Firebase (wypełnij własnymi danymi)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const allowedEmails = [
  "jan@example.com",
  "iza@example.com",
  "gosia@example.com"
];

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u && allowedEmails.includes(u.email)) {
        setUser(u);
      } else {
        setUser(null);
        if (u) signOut(auth);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError("Nieprawidłowy login lub hasło");
    }
  };

  if (!user) {
    return (
      <div style={{ padding: 20, maxWidth: 400, margin: "0 auto", fontFamily: "sans-serif" }}>
        <h2>Conspiratio 🔐</h2>
        <input
          style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
          placeholder="Hasło"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Zaloguj</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h2>Conspiratio 💬</h2>
      <p>Witaj, {user.email}</p>
      <button onClick={() => signOut(auth)}>Wyloguj</button>
      <div style={{ marginTop: 20 }}>
        {/* Tu może być czat, lista wiadomości itd. */}
        <p>Tu będzie czat 🔐</p>
      </div>
    </div>
  );
}

export default App;