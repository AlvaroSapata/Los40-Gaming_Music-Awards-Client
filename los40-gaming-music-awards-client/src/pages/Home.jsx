import ScaleLoader from "react-spinners/ScaleLoader";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import {
  getAllSongsService,
  addVoteToSongService,
  updateRemainingVotesService
} from "../services/songs.services";

function Home() {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);
  console.log(authContext.user);

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

console.log(authContext.user)

  const addVote = async (songId) => {
    try {
      // validaciones de si el usuario tiene votos y de si ha votado ya a esa cancion
      if (authContext.user.votosRestantes <= 0) {
        console.log("no quedan votos");
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
        const updateVotesRemaining = authContext.user.votosRestantes -1
        console.log(authContext.user)
        await updateRemainingVotesService(authContext.user._id, updateVotesRemaining)
        authContext.user.votosRestantes = updateVotesRemaining

        setSongs(updatedSongs);
        getData();
      }
    } catch (error) {
      console.log(error);
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
          {sortedSongs.map((eachSong) => (
            <div key={eachSong.titulo}>
              <p>{eachSong.titulo}</p>
              <p>{eachSong.artista}</p>
              <p>{eachSong.juego}</p>
              <p>{eachSong.votos}</p>
              <button onClick={() => addVote(eachSong.id)}>Votar</button>
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
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
