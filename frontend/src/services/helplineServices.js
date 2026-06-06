import API from "./api";

export const getHelplines = () =>
    API.get("/helplines");