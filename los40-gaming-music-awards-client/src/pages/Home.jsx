import ScaleLoader from "react-spinners/ScaleLoader";
import React, { useState, useEffect } from "react";
import {getAllSongsService} from "../services/songs.services"

function Home() {

  const [songs, setSongs] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await getAllSongsService()
      console.log(response.data)
      setSongs(response.data)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
    {isLoading? <ScaleLoader color="#471971" className="myLoader" />:<div>
      {songs.map((eachSong)=>(
        <div key={eachSong.id}>
          <p>{eachSong.titulo}</p>
          <p>{eachSong.artista}</p>
          <p>{eachSong.juego}</p>
          <p>{eachSong.votos}</p>
          {/* <iframe src={eachSong.link} frameborder="0"></iframe> */}
          <iframe width="560" height="315" src={eachSong.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          
        </div>
      ))}
    </div>}
    </div>
  )
}

export default Home