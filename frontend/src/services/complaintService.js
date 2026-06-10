import API from "./api";

export const createComplaint = (complaintData) => {
    return API.post ("/complaints", complaintData);
};

export const getMyComplaints = () => {
    return API.get("/complaints/my");
};

export const updateComplaint = (id , data) =>{
    return API.put(`/complaints/${id}`, data);
}; 

export const deleteComplaint = (id) => {
   return API.delete(`/complaints/${id}`);
};