import API from "./api";

export const getTherapists = () =>
    API.get("/therapy");