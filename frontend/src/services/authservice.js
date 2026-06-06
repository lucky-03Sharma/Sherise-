import API from "./api";
export const register = (userdata) => {
    return API.post("/auth/register", userdata);

};

export const login = (userdata) => {
    return API.post("auth/login", userdata);

};