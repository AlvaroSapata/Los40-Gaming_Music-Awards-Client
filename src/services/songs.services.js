import service from "./config.services";

const getAllSongsService = () => {
  return service.get("/songs");
};

const addVoteToSongService = (songId) => {
  return service.put(`/songs/vote/${songId}`);
};

const updateRemainingVotesService = (userId, votosRestantes) => {
  console.log(votosRestantes);
  return service.put(`/songs/${userId}`, votosRestantes);
};

const getMostVotedSongOfDayService = () => {
  return service.get("/songs/most-voted-song-of-day");
};

const getMostVotedSongOfWeekService = () => {
  return service.get("/songs/most-voted-song-of-week");
};

const getSongOfTheDayService = () => {
  return service.get("/songs/getRandomSong");
};

export {
  getAllSongsService,
  addVoteToSongService,
  updateRemainingVotesService,
  getMostVotedSongOfDayService,
  getMostVotedSongOfWeekService,
  getSongOfTheDayService,
};
