import service from "./config.services";

const getAllSongsService = () => {
    return service.get("/songs");
}

const addVoteToSongService = (songId, updatedSong) => {
    return service.put(`/songs/vote/${songId}`, updatedSong)
}

const updateRemainingVotesService = (userId, votosRestantes) => {
    console.log(votosRestantes)
    return service.put(`/songs/${userId}`, votosRestantes)}

export { getAllSongsService, addVoteToSongService,updateRemainingVotesService}