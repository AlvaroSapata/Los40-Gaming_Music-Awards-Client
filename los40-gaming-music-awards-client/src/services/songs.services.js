import service from "./config.services";

const getAllSongsService = () => {
    return service.get("/songs");
}

const addVoteToSongService = (songId) => {
    return service.put(`/songs/vote/${songId}`)
}

const updateRemainingVotesService = (userId, votosRestantes) => {
    console.log(votosRestantes)
    return service.put(`/songs/${userId}`, votosRestantes)}

export { getAllSongsService, addVoteToSongService,updateRemainingVotesService}