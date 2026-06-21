import React, {useState} from "react";
import {useNavigate, Navigate} from "react-router-dom";
import Cookies from "js-cookie";
import {LOGIN_URL, COOKIE_NAME} from "../../utils/constants";
import "./index.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (Cookies.get(COOKIE_NAME)) {
    return <Navigate to="/" replace />;
  }

  const onSubmitForm = async event => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (response.ok && data.data?.token) {
        Cookies.set(COOKIE_NAME, data.data.token, {
          expires: 30,
          path: "/",
        });

        navigate("/");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">Go Business</h1>

        <p className="tagline">
          Sign in to open your referral dashboard.
        </p>

        <form onSubmit={onSubmitForm}>
          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
            />
          </div>

          <button type="submit" disabled={loading}>
            Sign in
          </button>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;