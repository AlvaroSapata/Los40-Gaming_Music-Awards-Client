import ScaleLoader from "react-spinners/ScaleLoader";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../context/auth.context";
import {
  getAllSongsService,
  addVoteToSongService,
} from "../services/songs.services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchItem, setSearchItem] = useState("");
  const authContext = useContext(AuthContext);
  const [displayContainerIndex, setDisplayContainerIndex] = useState(null);
  const [displayArrowUp, setDisplayArrowUp] = useState(songs.map(() => false));

  // Create a state to store the initial positions of songs
  const [initialPositions, setInitialPositions] = useState({});

  // Fetch data and update initial positions on mount
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await getAllSongsService();
      const sortedSongs = response.data.sort((a, b) => b.votos - a.votos);

      // Save initial positions in state
      const positionsObject = {};
      sortedSongs.forEach((song, index) => {
        positionsObject[song._id] = index + 1;
      });

      setSongs(sortedSongs);
      setIsLoading(false);
      setInitialPositions(positionsObject); // Save initial positions
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get the initial position of the song based on votes
  const getInitialPosition = (songId) => {
    return initialPositions[songId];
  };

  // Filter and sort the songs whenever the searchItem changes
  const filteredSongs = useMemo(() => {
    const searchRegex = new RegExp(searchItem, "i");
    return songs.filter(
      (song) =>
        searchRegex.test(song.titulo) ||
        searchRegex.test(song.artista) ||
        searchRegex.test(song.juego)
    );
  }, [searchItem, songs]);

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
      console.log(error);
      // Mandamos al toast el error del BE
      if (!authContext.isLoggedIn) {
        toast.error("Debes estar logueado para votar");
      } else {
        toast.error(error.response.data.error);
      }
    }
  };

  // Funcion para manejar los cambios en la barra de busqueda
  const handleSearch = (event) => {
    setSearchItem(event.target.value);
  };

  return (
    <div>
      {isLoading ? (
        <ScaleLoader className="myLoader" />
      ) : (
        <div>
          <ToastContainer autoClose={2000} />
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
