import service from "./config.services";

const getAllSongsService = () => {
    return service.get("/songs");
}

export { getAllSongsService}