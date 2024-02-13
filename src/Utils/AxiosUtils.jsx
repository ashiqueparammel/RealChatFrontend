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

const attachToken = (req) =>{
    let authToken = localStorage.getItem('token')
    const accesstoken = JSON.parse(authToken);
    if (accesstoken){
        req.headers.Authorization = `Bearer ${accesstoken.access}`;
    }
    return req
}

const UserAxiosInstant = CreateAxios()
UserAxiosInstant.interceptors.request.use(async (req) =>{
    const modifiedRequest = attachToken(req)
    return modifiedRequest
})

export {UserAxiosInstant}