import ScaleLoader from "react-spinners/ScaleLoader";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import {
  getAllSongsService,
  addVoteToSongService,
  updateRemainingVotesService,
} from "../services/songs.services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchItem, setSearchItem] = useState("");
  const authContext = useContext(AuthContext);

  const [displayContainerIndex, setDisplayContainerIndex] = useState(null);
  // const [displayArrowUp, setDisplayArrowUp] = useState(false);
  const [displayArrowUp, setDisplayArrowUp] = useState({});

  const getData = async () => {
    try {
      const response = await getAllSongsService();
      setSongs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // funcion para que solo aplique los efectos de toggle al elemento especifico
  const toggleContainer = (index) => {
    if (displayContainerIndex === index) {
      setDisplayContainerIndex(null);
      setDisplayArrowUp((prevState) => ({
        ...prevState,
        [index]: false,
      }));
    } else {
      setDisplayContainerIndex(index);
      setDisplayArrowUp((prevState) => {
        const updatedState = {};
        for (const key in prevState) {
          if (prevState.hasOwnProperty(key)) {
            updatedState[key] = key === index.toString();
          }
        }
        return updatedState;
      });
    }
  };

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

      // Actualizamos el estado, y llamamos a getData para ver los cambios en tiempo real
      setSongs(updatedSongs);
      getData();
    } catch (error) {
      // Mandamos al toast el error del BE
      toast.error(error.response.data.error);
    }
  };

  // Funcion para manejar los cambios en la barra de busqueda
  const handleSearch = (event) => {
    setSearchItem(event.target.value);
  };

  // Filtrar canciones según el término de búsqueda
  const filteredSongs = songs.filter((song) => {
    const searchRegex = new RegExp(searchItem, "i"); // Expresión regular para hacer la búsqueda sin distinción entre mayúsculas y minúsculas
    return (
      searchRegex.test(song.titulo) ||
      searchRegex.test(song.artista) ||
      searchRegex.test(song.juego)
    );
  });

  useEffect(() => {
    getData();
  }, []);

  // Ordenar las canciones por número de votos
  const sortedSongs = filteredSongs.sort((a, b) => b.votos - a.votos);

  return (
    <div>
      {isLoading ? (
        <ScaleLoader color="#471971" className="myLoader" />
      ) : (
        <div>
          <ToastContainer />
          {/* Barra de búsqueda */}
          <div className="searchContainer">
            <input
              type="text"
              value={searchItem}
              onChange={handleSearch}
              placeholder="Buscar canciones..."
            />
          </div>
          <div className="colorcitosContainer3"></div>
          {sortedSongs.map((eachSong, index) => (
            <div key={eachSong._id} className="mainContainer">
              <div className="firstContainer">
                <div className="colorcitosContainer"></div>
                <div
                  className={
                    index === 0
                      ? "positionContainer first"
                      : "positionContainer"
                  }
                >
                  <p>{index + 1}</p>
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
