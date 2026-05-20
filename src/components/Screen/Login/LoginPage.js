import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff, LuGlobe, LuLock, LuUser } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";
import "./LoginPage.scss";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const backgroundStyle = useMemo(
    () => ({ backgroundImage: `url(${process.env.PUBLIC_URL}/intro.jpg)` }),
    [],
  );

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Vui lòng nhập tên tài khoản.");
      return;
    }

    if (!password) {
      setError("Vui lòng nhập mật khẩu.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(identifier, password, remember);
      setLoading(false);

      if (result.success) {
        navigate("/dashboard");
        return;
      }

      setError(result.error);
    }, 300);
  };

  const handleDemoLogin = () => {
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = login("admin", "admin123", true);
      setLoading(false);

      if (result.success) {
        navigate("/dashboard");
        return;
      }

      setError(result.error);
    }, 200);
  };

  return (
    <div className="login" style={backgroundStyle}>
      <div className="login-overlay"></div>

      <div className="login-card">
        <div className="login-card-inner">
          <div className="login-header">
            <h1>Đăng nhập</h1>
            <button
              type="button"
              className="login-language"
              aria-label="Ngôn ngữ tiếng Việt"
            >
              <LuGlobe />
              <span>Vi</span>
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <span className="login-field-icon">
                <LuUser />
              </span>
              <input
                type="text"
                placeholder="Tên tài khoản"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoFocus
              />
            </div>

            <div className="login-field">
              <span className="login-field-icon">
                <LuLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="login-field-action"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Hiện hoặc ẩn mật khẩu"
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>

            <label className="login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <span>Lưu đăng nhập</span>
            </label>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Đang đăng nhập" : "Đăng nhập"}
            </button>

            <div className="login-links">
              <button
                type="button"
                onClick={() => window.alert("Chưa cấu hình đăng ký tài khoản.")}
              >
                Đăng ký tài khoản
              </button>
              <button
                type="button"
                onClick={() =>
                  window.alert(
                    "Vui lòng liên hệ quản trị viên để được cấp lại mật khẩu.",
                  )
                }
              >
                Quên mật khẩu
              </button>
            </div>

            <button
              type="button"
              className="login-demo"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              Tài khoản trải nghiệm
            </button>
          </form>
        </div>
      </div>

      <div className="login-footer">
        <span>Phiên bản: 1.1</span>
        <span>BESS</span>
      </div>
    </div>
  );
}
