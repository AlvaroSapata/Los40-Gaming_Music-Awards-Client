import ScaleLoader from "react-spinners/ScaleLoader";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../context/auth.context";
import {
  getAllSongsService,
  addVoteToSongService,
  getMostVotedSongOfDayService,
  getMostVotedSongOfWeekService,
} from "../services/songs.services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  // LLama al contexto
  const authContext = useContext(AuthContext);
  //* _____ Estados _____
  //  Almacena la lista de canciones obtenida desde el servidor.
  const [songs, setSongs] = useState([]);
  // Indica si se está cargando la información de las canciones desde el servidor. Cuando está en true, se muestra un spinner de carga.
  const [isLoading, setIsLoading] = useState(true);
  // Almacena el valor de la barra de búsqueda para filtrar las canciones por título, artista o juego.
  const [searchItem, setSearchItem] = useState("");
  // Guarda el índice del contenedor que se debe mostrar con información adicional de una canción cuando el usuario hace clic en la flecha de despliegue.
  const [displayContainerIndex, setDisplayContainerIndex] = useState(null);
  // Es un array de booleanos que indica si la flecha de despliegue debe apuntar hacia arriba o hacia abajo para cada canción en la lista.
  const [displayArrowUp, setDisplayArrowUp] = useState(songs.map(() => false));
  // Es un objeto que guarda la posición inicial de cada canción en la lista según el número de votos.
  const [initialPositions, setInitialPositions] = useState({});
  // Guarda la canción aleatoria del día. Se utiliza para mostrar una canción seleccionada al azar en la página.
  const [randomSong, setRandomSong] = useState(null);
  // Almacena la canción más votada del día.
  const [mostVotedSongOfDay, setMostVotedSongOfDay] = useState(null);
  // Almacena la canción más votada de la semana.
  const [mostVotedSongOfWeek, setMostVotedSongOfWeek] = useState(null);

  //* _____ Funciones _____
  // useEffect => Obtiene datos y actualiza al montar
  useEffect(() => {
    // Obtiene los datos de las canciones desde el servidor y actualiza el estado "songs" con la lista ordenada por votos
    getData();
    // Comprueba que se haya elegido la cancion aleatoria
    const storedDate = localStorage.getItem("randomSongDate");
    const currentDate = new Date().toDateString();

    if (storedDate === currentDate) {
      const storedRandomSong = localStorage.getItem("randomSong");
      if (storedRandomSong) {
        setRandomSong(JSON.parse(storedRandomSong));
      } else {
        setRandomSong(null); // Set to null if randomSong data is not found in localStorage
      }
    } else {
      // Si no, llamamos a la funcion para obtener una nueva
      getRandomSong();
    }
    // Obtiene la cancion mas votada del dia
    getMostVotedSongOfDay();
    // Obtiene la cancion mas votada del dia
    getMostVotedSongOfWeek();

    // Muestra el toast de bienvenida con sus estilos
    toast("Bienvido a los40 Gaming Music Awards", {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 800,
      hideProgressBar: true,
      closeButton: false,
      pauseOnFocusLoss: false,
      pauseOnHover: false,

      style: {
        width: "97vw",
        height: "95vh",
        maxWidth: "100vw",
        icon: false,
        textAlign: "center",
        color: "#fff",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#000",
        fontSize: "46px",
      },
      toastId: "welcome-toast",
    });
  }, []);

  // Realiza una llamada al servidor para obtener la lista de canciones y las ordena por la cantidad de votos. Actualiza los estados de songs, isLoading, y initialPositions.
  const getData = async () => {
    try {
      // Obtiene la lista de canciones del BE
      const response = await getAllSongsService();
      // Ordena por cantidad de votos
      const sortedSongs = response.data.sort((a, b) => b.votos - a.votos);

      // Crea un objeto vacio para almacenar las posiciones iniciales
      const positionsObject = {};
      // Se itera en la lista de canciones dandoles su posicion inicial
      sortedSongs.forEach((song, index) => {
        positionsObject[song._id] = index + 1;
      });
      // Se actualizan los estados
      setSongs(sortedSongs);
      setIsLoading(false);
      setInitialPositions(positionsObject);
    } catch (error) {
      console.log(error);
    }
  };
  // Realiza una llamada al servidor para obtener todas las canciones y luego elige una canción al azar de esa lista. Guarda la canción aleatoria seleccionada en el estado randomSong y también la fecha actual en el almacenamiento local para recordar qué canción se eligió ese día.
  const getRandomSong = async () => {
    try {
      // Obtiene la lista de canciones del BE
      const response = await getAllSongsService();
      const songs = response.data;

      // Elige una cancion aleatoria de la lista
      const randomIndex = Math.floor(Math.random() * songs.length);
      const randomChosenSong = songs[randomIndex];

      // Guarda la cancion elegida y la fecha ( String )
      const currentDate = new Date().toDateString();
      localStorage.setItem("randomSong", JSON.stringify(randomChosenSong));
      localStorage.setItem("randomSongDate", currentDate);

      // Actualiza el estado
      setRandomSong(randomChosenSong);
    } catch (error) {
      console.log(error);
    }
  };

  // Devuelve la posición inicial de una canción en la lista según la cantidad de votos. Utiliza el estado initialPositions para obtener esta información.
  const getInitialPosition = (songId) => {
    return initialPositions[songId];
  };

  // Filtra y ordena cuando las dependencias cambian
  const filteredSongs = useMemo(() => {
    // Sin distincion entre mayusculas y minusculas
    const searchRegex = new RegExp(searchItem, "i");
    return songs.filter(
      (song) =>
        searchRegex.test(song.titulo) ||
        searchRegex.test(song.artista) ||
        searchRegex.test(song.juego)
    );
  }, [searchItem, songs]);

  // Maneja el despliegue/ocultación del contenedor de información adicional de una canción cuando el usuario hace clic en la flecha de despliegue.
  const toggleContainer = (index) => {
    if (displayContainerIndex === index) {
      setDisplayContainerIndex(null);
      setDisplayArrowUp((prevState) => {
        const updatedState = [...prevState];
        updatedState[index] = false;
        return updatedState;
      });
    } else {
      setDisplayContainerIndex(index);
      setDisplayArrowUp((prevState) => {
        const updatedState = [...prevState];
        updatedState[index] = true;
        return updatedState;
      });
    }
  };

  // Maneja el proceso de votación de una canción. Realiza una llamada al servidor para agregar un voto a la canción seleccionada y luego actualiza los estados de songs, mostVotedSongOfDay, y mostVotedSongOfWeek con la información actualizada después de votar
  const addVote = async (songId) => {
    try {
      // llamamos al servicio de añadir un voto
      const response = await addVoteToSongService(songId);
      console.log(response);

      // Guardamos la cancion con los datos actualizados
      const updatedSong = response.data;
      console.log(updatedSong);

      // Recorremos el array comprobando que coincida el id, si es correcto devolvemos la cancion actualizada, si no, devolvemos la cancion tal cual
      const updatedSongs = songs.map((eachSong) => {
        if (eachSong._id === updatedSong._id) {
          console.log(eachSong);
          return updatedSong;
        }
        return eachSong;
      });

      // Actualizamos el estado, y llamamos a los get para ver los cambios en tiempo real
      setSongs(updatedSongs);
      getData();
      getMostVotedSongOfDay();
      getMostVotedSongOfWeek();
    } catch (error) {
      console.log(error);
      // Mandamos al toast el error del BE
      if (!authContext.isLoggedIn) {
        toast.error("Debes estar logueado para votar");
      } else {
        toast.error(error.response.data.error);
      }
    }
  };

  // Maneja los cambios en la barra de búsqueda y actualiza el estado searchItem con el valor ingresado por el usuario.
  const handleSearch = (event) => {
    setSearchItem(event.target.value);
  };

  // Realiza una llamada al servidor para obtener la canción más votada del día y actualiza el estado mostVotedSongOfDay.
  const getMostVotedSongOfDay = async () => {
    try {
      const response = await getMostVotedSongOfDayService();
      setMostVotedSongOfDay(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Realiza una llamada al servidor para obtener la canción más votada de la semana y actualiza el estado mostVotedSongOfWeek.
  const getMostVotedSongOfWeek = async () => {
    try {
      const response = await getMostVotedSongOfWeekService();
      setMostVotedSongOfWeek(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <ScaleLoader className="myLoader" />
      ) : (
        <div>
          <ToastContainer autoClose={2000} />
          <div className="colorcitosContainer3"></div>
          {/* Seccion principal */}
          <div className="randomSongContainer">
            {randomSong && (
              <>
                <h3>Cancion del dia Ballentines</h3>
                <div className="circularContainer">
                  <div className="circularImageContainer">
                    <img src="/imgs/0.jpg" alt="portada" />
                  </div>
                  <div className="circularTitle">
                    <h3>{randomSong.titulo}</h3>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Most voted song of the day */}
          <div className="randomSongContainer">
            {mostVotedSongOfDay && (
              <>
                <h3>Cancion mas votada del dia</h3>
                <div className="circularContainer">
                  <div className="circularImageContainer">
                    <img src="/imgs/0.jpg" alt="portada" />
                  </div>
                  <div className="circularTitle">
                    <h3>{mostVotedSongOfDay.titulo}</h3>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Most voted song of the week */}
          <div className="randomSongContainer">
            {mostVotedSongOfWeek && (
              <>
                <h3>Cancion mas votada de la semana</h3>
                <div className="circularContainer">
                  <div className="circularImageContainer">
                    <img src="/imgs/0.jpg" alt="portada" />
                  </div>
                  <div className="circularTitle">
                    <h3>{mostVotedSongOfWeek.titulo}</h3>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="colorcitosContainer3"></div>
          {/* Barra de búsqueda */}
          <div className="searchContainer">
            <input
              type="text"
              value={searchItem}
              onChange={handleSearch}
              placeholder=" Buscar canciones..."
            />
          </div>

          <div className="colorcitosContainer3"></div>
          {/* Random Song */}

          {filteredSongs.map((eachSong, index) => (
            <div key={eachSong._id} className="mainContainer">
              <div className="firstContainer">
                <div className="colorcitosContainer"></div>

                <div
                  className={
                    getInitialPosition(eachSong._id) === 1
                      ? "positionContainer first"
                      : "positionContainer"
                  }
                >
                  <p>{getInitialPosition(eachSong._id)}</p>
                </div>
                <div className="imgContainer">
                  <img src="/imgs/0.jpg" alt="portada" />
                </div>
                <div className="infoContainer">
                  <h3>{eachSong.titulo}</h3>
                  <p>{eachSong.artista}</p>
                  <p>{eachSong.juego}</p>
                </div>
                <div className="votesContainer">
                  <p>Votos: {eachSong.votos}</p>
                  <button onClick={() => addVote(eachSong._id)}>Votar</button>
                  <img
                    src={
                      displayArrowUp[index]
                        ? "/imgs/arrow top.png"
                        : "/imgs/arrow bottom.png"
                    }
                    alt="down"
                    onClick={() => toggleContainer(index)}
                  />
                </div>
              </div>
              <div
                className={
                  displayContainerIndex === index
                    ? "secondContainer"
                    : "secondContainer hidden"
                }
              >
                <div className="colorcitosContainer2"></div>
                <div
                  className={
                    index === 0 ? "lineaContainer first" : "lineaContainer"
                  }
                ></div>
                <iframe
                  width="560"
                  height="315"
                  src={eachSong.link}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
