import React, { useEffect, useState } from "react";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Typography } from "@material-tailwind/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { google_Access_Token } from "../../Constants/Constants";
import { loginGoogleOAuth, loginUser } from "../../Services/UserApi";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Validforms from "../../Helpers/Validforms";
import LogoSpinner from "../../Helpers/LogoSpinner";
// import { getFCMToken, sendTokenToBackend } from "../../firebase";

function Login() {
  const location = useLocation();
  const [LoadingManage, setLoadingManage] = useState(false);

  let message = new URLSearchParams(location.search)?.get("message") ?? null;

  useEffect(() => {
    if (message) {
      toast.success(message);
      message = null;
    }
  }, [message]);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let googleData = "";
  const LoginWithGoogleAuth = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleData = codeResponse;
      GoogleAuth();
    },
    onError: (error) => {
      toast.error(error);
      console.log("Login Failed:", error);
    },
  });

  const GoogleAuth = async () => {
    try {
      setLoadingManage(true);
      if (!googleData) return;
      const tokenData = await axios.get(
        google_Access_Token + googleData.access_token,
        {
          headers: {
            Authorization: `Bearer ${googleData.access_token}`,
            Accept: "application/json",
          },
        }
      );
      const access_token = googleData.access_token;
      console.log(access_token, "====================>>>>>>>>>");
      googleData = tokenData.data;
      const googleUser = {
        email: googleData.email,
        access_token: access_token,
      };
      try {
        const data = await loginGoogleOAuth(googleUser);
        if (data.status === 200) {
          const userToken = data.token;
          try {
            const token = jwtDecode(userToken.access);
            localStorage.setItem("token", JSON.stringify(userToken));
            if (token.is_active === true && token.is_superuser === false) {
              setLoadingManage(false);

              toast.success(data.message);
              setTimeout(() => {
                navigate("/");
              }, 1000);
            }
          } catch (error) {
            setLoadingManage(false);

            toast.error(error.message);
          }
        } else {
          toast.error(data.message);
          setLoadingManage(false);
        }
      } catch (error) {
        toast.error(error.message);
        setLoadingManage(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoadingManage(false);
    }
  };

  const loginHandle = async () => {
    const user = {
      email: email,
      password: password,
    };

    const is_Valid = Validforms(user);

    if (is_Valid) {
      setLoadingManage(true);

      const token = await loginUser(user);
      console.log(token);

      if (token.status === 200) {
        const userToken = token.data;
        try {
          const decodedToken = jwtDecode(userToken.access);
          localStorage.setItem("token", JSON.stringify(userToken));

          if (decodedToken.is_active && !decodedToken.is_superuser) {
            setLoadingManage(false);

            // Get the FCM token after successful login
            const fcmToken = await getFCMToken();
            if (fcmToken) {
              // Send the token to the backend
              await sendTokenToBackend(fcmToken);
            }

            toast.success("Login successfully!");
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        } catch (error) {
          toast.error(error.message);
          setLoadingManage(false);
        }
      } else if (token.response.status === 401) {
        setLoadingManage(false);
        toast.error(token.response.data.detail);
      }
    }
  };

  return (
    <div className="bg-[#000000]  w-full h-svh flex justify-center ">
      <>
        {LoadingManage ? (
          <div className="bg-opacity-50 items-center ">
            <LogoSpinner />
          </div>
        ) : (
          ""
        )}
      </>
      <Card className="bg-transparent  h-[60%] 2xl:w-[35%] xl:w-[40%] lg:w-[40%] md:w-[50%] 2xl:mt-40 xl:mt-28 lg:mt-24 md:mt-20 sm:mt-14 mt-10 w-[90%] sm:w-[80%] flex flex-col justify-center shadow-none items-center rounded-lg gap-5">
        <Typography className="font-prompt text-[#FAFAFA] text-3xl 2xl:absolute 2xl:-top-5">
          LOGIN
        </Typography>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          className="w-[80%] h-[14%] bg-transparent rounded-md border font-prompt   text-white hover:text-black border-[#FAFAFA] focus:border-white outline-none  hover:bg-white pl-6"
          placeholder="Enter Your Email"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-[80%] h-[14%] bg-transparent rounded-md border font-prompt  text-white hover:text-black border-[#FAFAFA] focus:border-white outline-none  hover:bg-white pl-6"
          placeholder="Enter Your Password"
        />
        <Button
          onClick={loginHandle}
          className="font-prompt-normal bg-transparent 2xl:text-2xl xl:text-2xl lg:text-xl md:text-lg sm:text-lg text-md text-white shadow-white shadow-none w-[80%] h-[14%] border-[#FAFAFA] border-[1px] hover:border-[1px]"
        >
          {" "}
          LOGIN{" "}
        </Button>
        <Button
          onClick={() => LoginWithGoogleAuth()}
          className=" flex items-center text-white bg-transparent shadow-white shadow-none w-[80%] h-[14%] border-[#FAFAFA] border-[1px] hover:border-[1px] hover:shadow-2xl "
        >
          <span>
            <FontAwesomeIcon
              className="bg-white  rounded-md text-black p-1 bgcolors 2xl:w-6 2xl:h-6 2xl:mr-5 xl:w-6 xl:h-6 xl:mr-4 lg:w-5 lg:h-5 lg:mr-2 md:w-4 md:h-4 mr-3"
              icon={faGoogle}
            />
          </span>
          <span className=" font-prompt-normal bg-transparent 2xl:text-2xl xl:text-2xl lg:text-xl md:text-lg sm:text-lg text-md">
            SIGN IN WITH GOOGLE
          </span>
        </Button>
        <p
          onClick={() => navigate("/signup")}
          className="signupfont text-white opacity-30 hover:opacity-100  hover:cursor-pointer"
        >
          New User? Get Started Here
        </p>
      </Card>
      <Toaster />
    </div>
  );
}

export default Login;
