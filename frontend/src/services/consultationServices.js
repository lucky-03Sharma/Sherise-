import API from "./api";

export const createConsultation = (data) =>
    API.post("/consultation/create", data);

export const getMyConsultations = () =>
    API.get("/consultation/my");