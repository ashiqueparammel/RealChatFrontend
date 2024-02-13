import axios from "axios";
import { UserAxiosInstant } from "../Utils/AxiosUtils";
import { baseURL } from "../Constants/Constants";

const Home = async (value) => {
    try {
        return await UserAxiosInstant.get(
            `accounts/updateuser/`, value, {
            withCredentials: true
        }
        );
    } catch (error) {
        console.log(error);
    }
}

const loginGoogleOAuth = (user) => {
    axios.post(baseURL,user).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(error);
    })
}


export { loginGoogleOAuth }