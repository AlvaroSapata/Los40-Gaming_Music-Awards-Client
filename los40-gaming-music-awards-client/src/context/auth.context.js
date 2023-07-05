import { createContext, useEffect, useState } from "react";
import { verifyService } from "../services/auth.services";
import ScaleLoader from "react-spinners/ScaleLoader";

const AuthContext = createContext();

function AuthWrapper(props) {
  // 1-1 esta el usuario logueado??
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //1.2 quien es el usuario logueado??
  const [user, setUser] = useState(null);
  // Funcion isloading => la app empieza validando el token
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authenticateUser();
  }, []);

  // Funcion que invoca el servicio de verify para validar el token
  const authenticateUser = async (user) => {
    try {
      const response = await verifyService();
      console.log("token chekeado");

      // desde aqui el usuarario esta logueado
      setIsLoggedIn(true);
      // info del usuario
      setUser(response.data.payload);
      // deja de cargar
      setIsLoading(false);
    } catch (error) {
      // actualiza el estado de la app
      setIsLoggedIn(false);
      setUser(null);
      setIsLoading(false);
    }
  };
  //2* el objeto de contexto que pasaremos
  const passedContext = {
    isLoggedIn,
    user,
    authenticateUser,
  };

  if (isLoading) {
    return <ScaleLoader color="#471971" className="myLoader" />;

    //3* la renderizacion de la app con el contexto pasado
  }
  return (
    <AuthContext.Provider value={passedContext}>
      {props.children}
    </AuthContext.Provider>
  );
}

//* devemos envolver app en index.js

export { AuthContext, AuthWrapper };
