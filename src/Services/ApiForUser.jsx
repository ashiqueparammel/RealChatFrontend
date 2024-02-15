// import axios from "axios";
// import { UserAxiosInstant } from "../Utils/AxiosUtils";
// import { LoginURL, baseURL, googleLoginURL, googleSignupURL, signupURL } from "../Constants/Constants";

// const listUserHome = async (value) => {
//     try {
//         return await UserAxiosInstant.get(
//             `accounts/updateuser/`,value, {
//             withCredentials: true
//         }
//         );
//     } catch (error) {
//         console.log(error);
//     }
// }


// const loginGoogleOAuth = async (user) => {
//     try {
//         const response = await axios.post(baseURL + googleLoginURL, user);
//         return response.data
//     } catch (error) {
//         return error;
//     }
// }

// const loginUser = async (user) => {
//     try {
//         const response = await axios.post(baseURL + LoginURL, user);
//         console.log(response);
//         return response
//     } catch (error) {
//         return error;
//     }

// }

// const signupUser = async (user) => {
//     try {
//         const response = await axios.post(baseURL + signupURL, user);
//         console.log(response);
//         return response.data
//     } catch (error) {
//         return error;
//     }

// }

// const signupGoogleOAuth = async (user) => {
//     try {
//         const response = await axios.post(baseURL + googleSignupURL, user);
//         return response.data;
//     } catch (error) {
//         return error;
//     }
// }



// export { loginGoogleOAuth, signupGoogleOAuth, loginUser,signupUser,listUserHome }