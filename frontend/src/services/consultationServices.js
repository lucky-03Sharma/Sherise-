import API from "./api";

export const createConsultation = (data) =>
    API.post("/consultations/create", data);

export const getMyConsultations = () =>
    API.get("/consultations/my");