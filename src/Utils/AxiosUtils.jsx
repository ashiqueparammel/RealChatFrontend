import axios from "axios"
import { baseURL } from "../Constants/Constants"
const CreateAxios = () =>{
    const upadtedUrl = axios.create({
        baseURL,
        timeout: 8000,
        timeoutErrorMessage: "Request timeout Please Try Again!!!"
    })
    return upadtedUrl
}

const attachToken = (req) => {
    const authToken = localStorage.getItem('token');
    const accessToken = JSON.parse(authToken);
    
    if (accessToken) {
        req.headers = {
            ...req.headers,
            Authorization: `Bearer ${accessToken.access}`
        };
    }
    return req;
}

const UserAxiosInstant = CreateAxios()
UserAxiosInstant.interceptors.request.use(async (req) =>{
    const modifiedRequest = attachToken(req)
    return modifiedRequest
})

export {UserAxiosInstant}