import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupService } from "../../services/auth.services";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerification, setPasswordVerification] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handlePasswordChangeVerification = (e) =>
    setPasswordVerification(e.target.value);

  const handleSingup = async (e) => {
    e.preventDefault();

    if (password !== passwordVerification) {
      return setErrorMessage("No coinciden las contraseñas");
    }

    try {
      const user = {
        username: username,
        email: email,
        password: password,
      };

      await signupService(user);
      navigate("/login");
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        //navigate("/error");
        console.log(error);
      }
    }
  };

  return (
    <div className="login-box">
      <pre>
        <h2>Registro</h2>
      </pre>
      <form onSubmit={handleSingup}>
        <div className="formGroupContainer">
          <label>Nombre de usuario</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>

        <div className="formGroupContainer">
          <label>Email</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>

        <div className="formGroupContainer">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        <div className="formGroupContainer">
          <label>Repite la Contraseña</label>
          <input
            type="password"
            value={passwordVerification}
            onChange={handlePasswordChangeVerification}
          />
        </div>

        <button type="submit" className="myButtons">
          Registrar
        </button>
        <pre>
          {errorMessage && <p style={{ color: "#03e9f4" }}>{errorMessage}</p>}
        </pre>
      </form>
      <div className="linksRegistroLogin">
        <p>¿Ya tienes una cuenta? </p>
        <a href="/login">Login</a>
      </div>
    </div>
  );
}

export default Signup;
