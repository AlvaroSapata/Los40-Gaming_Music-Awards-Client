import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupService } from "../../services/auth.services";
import Form from "react-bootstrap/Form";

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
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        //navigate("/error");
        console.log(error);
      }
    }
  };

  return (
    <div className="login-box">
      <pre>
        <h2>Signup</h2>
      </pre>
      <Form onSubmit={handleSingup}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </Form.Group>

        <br />
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
        </Form.Group>

        <br />

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </Form.Group>

        <br />

        <Form.Group className="mb-3">
          <Form.Label>Repite la Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={passwordVerification}
            onChange={handlePasswordChangeVerification}
          />
        </Form.Group>

        <br />

        <button type="submit" className="myButtons">
          Sign Up
        </button>
        <pre>
          {errorMessage && <p style={{ color: "#03e9f4" }}>{errorMessage}</p>}
        </pre>
      </Form>
    </div>
  );
}

export default Signup;
