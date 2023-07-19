import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { loginService } from "../../services/auth.services";
import Form from "react-bootstrap/Form";

function Login() {
  const { authenticateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      //1 token con las credentials
      const response = await loginService({
        email: email,
        password: password,
      });
      //guardamos el token en el local storage
      localStorage.setItem("authToken", response.data.authToken);

      await authenticateUser();

      //3. redireccionamos a la pantalla privada para solo usuarios
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        navigate("/");
      }
    }
  };
  return (
    <div className="login-box">
      <pre>
        <h2>Login</h2>
      </pre>
      <form onSubmit={handleLogin}>
        <div className="formGroupContainer">
          <label >Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div className="formGroupContainer">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        {/*  <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </Form.Group> */}

        <br />
        <button type="submit" style={{ width: "auto" }}>
          Log In
        </button>
        <br />
        {errorMessage && <p style={{ color: "#03e9f4" }}>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Login;
