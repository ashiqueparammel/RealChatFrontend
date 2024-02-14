import axios from "axios";
import { UserAxiosInstant } from "../Utils/AxiosUtils";
import { LoginURL, baseURL, googleLoginURL, googleSignupURL } from "../Constants/Constants";

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


const loginGoogleOAuth = async (user) => {
    try {
        const response = await axios.post(baseURL + googleLoginURL, user);
        return response.data
    } catch (error) {
        return error;
    }
}

const loginUser = async (user) => {
    try {
        const response = await axios.post(baseURL + LoginURL, user);
        return response.data
    } catch (error) {
        return error;
    }

}

const signupGoogleOAuth = async (user) => {
    try {
        const response = await axios.post(baseURL + googleSignupURL, user);
        return response.data;
    } catch (error) {
        return error;
    }
}



export { loginGoogleOAuth, signupGoogleOAuth, loginUser }