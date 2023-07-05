import service from "./config.services";

const getAllSongsService = () => {
    return service.get("/songs");
}

const addVoteService = (songId, updatedSong) => {
    return service.put(`/songs/vote/${songId}`, updatedSong)
}

export { getAllSongsService, addVoteService}