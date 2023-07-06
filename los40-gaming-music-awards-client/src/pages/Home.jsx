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
  const authContext = useContext(AuthContext);

  const [displayContainerIndex, setDisplayContainerIndex] = useState(null);
  // const [displayArrowUp, setDisplayArrowUp] = useState(false);
  const [displayArrowUp, setDisplayArrowUp] = useState({});

  const getData = async () => {
    try {
      const response = await getAllSongsService();
      console.log(response.data);
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
        [index]: false
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
      // validaciones de si el usuario tiene votos y de si ha votado ya a esa cancion
      console.log(authContext.isLoggedIn);
      // if(authContext.isLoggedIn){}
      if (authContext.isLoggedIn && authContext.user.votosRestantes <= 0) {
        console.log("no quedan votos");
        toast.error("No te quedan votos, vuelve mañana");
      } else {
        const response = await addVoteToSongService(songId);
        console.log(response);

        const updatedSong = response.data.song;
        console.log(updatedSong);

        const updatedSongs = songs.map((eachSong) => {
          if (eachSong.id === updatedSong.id) {
            console.log(eachSong);
            return updatedSong;
          }
          return eachSong;
        });

        // quitar un voto al usuario
        const updateVotesRemaining = authContext.user.votosRestantes - 1;
        console.log(authContext.user);
        await updateRemainingVotesService(
          authContext.user._id,
          updateVotesRemaining
        );
        authContext.user.votosRestantes = updateVotesRemaining;

        setSongs(updatedSongs);
        getData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Para votar necesitas estar logueado");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Ordenar las canciones por número de votos
  const sortedSongs = songs.sort((a, b) => b.votos - a.votos);

  return (
    <div>
      {isLoading ? (
        <ScaleLoader color="#471971" className="myLoader" />
      ) : (
        <div>
          <ToastContainer />
          <div className="colorcitosContainer3"></div>
          {sortedSongs.map((eachSong, index) => (
            <div key={eachSong.id} className="mainContainer">
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
                  <button onClick={() => addVote(eachSong.id)}>Votar</button>
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
