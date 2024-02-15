import React, { useState } from 'react';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Typography } from '@material-tailwind/react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { google_Access_Token } from '../../Constants/Constants';
import axios from 'axios';
import { loginUser, signupGoogleOAuth, signupUser } from '../../Services/UserApi';
import { jwtDecode } from 'jwt-decode';
import Validforms from '../../Helpers/Validforms';


function Signup() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    let googleData = ''
    const signupWithGoogleAuth = useGoogleLogin({
        onSuccess: (codeResponse) => {
            googleData = codeResponse
            GoogleAuth();
        },
        onError: (error) => { toast.error(error) },
    });

    const GoogleAuth = async () => {
        try {
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
            googleData = tokenData.data;
            const googleUser = {
                username: googleData.given_name,
                email: googleData.email,
                password: googleData.id,
                password2: googleData.id,
                phone_number: '',
                is_google: true,
            }
            try {
                const data = await signupGoogleOAuth(googleUser);
                if (data.status === 201) {
                    toast.success(data.Text);
                    const loginData = {
                        email: googleData.email,
                        password: googleData.id,
                    }
                    const userToken = await loginUser(loginData);
                    try {
                        const token = jwtDecode(userToken.data.access)
                        localStorage.setItem('token', JSON.stringify(userToken.data));
                        if (token.is_active === true && token.is_superuser === false) {
                            navigate('/');
                        }
                    } catch (error) {
                        console.error('Error decoding JWT:', error);
                        toast.error(error.message);
                    }
                }
            } catch (error) {
                console.error('Error login:', error);
                toast.error(error.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    const signupHandle = async () => {
        const user = {
            username: username,
            email: email,
            password: password,
            password2: password,
            is_google: false,
            signup: true
        }
        const is_Valid = Validforms(user)
        if (is_Valid) {

            const signupData = await signupUser(user)
            console.log(signupData);
            if (signupData.status === 201) {
                toast.success(signupData.Text)
                setTimeout(() => {
                    toast.success('Check Your Mail and Activate Your Account!')
                    const Gmail = () => {
                        window.open("https://mail.google.com/mail/u/0/#inbox", "_blank")
                    };
                    Gmail()
                    navigate('/login')
                }, 1000);
            }

            if (signupData.status === 404) {
                if (signupData.Text.email) {
                    toast.error(signupData.Text.email)
                }
                if (signupData.Text.username) {
                    toast.error(signupData.Text.username)
                }
                if (signupData.Text.password) {
                    toast.error(signupData.Text.password)
                }

            }

        }

    }

    const navigate = useNavigate()
    return (
        <div className='bg-[#000000] w-full h-[695px] flex justify-center '>
            <Card className='bg-transparent  h-[60%] 2xl:w-[35%] xl:w-[40%] lg:w-[40%] md:w-[50%] 2xl:mt-40 xl:mt-28 lg:mt-24 md:mt-20 sm:mt-14 mt-10 w-[90%] sm:w-[80%] flex flex-col justify-center shadow-none items-center rounded-lg gap-5'>
                <Typography className='font-prompt text-[#FAFAFA] text-3xl 2xl:absolute 2xl:-top-14'>SIGN UP</Typography>
                <input
                    type="text" onChange={(e) => setUsername(e.target.value)}
                    className="w-[80%] h-[14%] bg-transparent rounded-md border font-prompt   text-white hover:text-black border-[#FAFAFA] focus:border-white outline-none  hover:bg-white pl-6"
                    placeholder="Enter Your username"
                />
                <input
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-[80%] h-[14%] bg-transparent rounded-md border font-prompt   text-white hover:text-black border-[#FAFAFA] focus:border-white outline-none  hover:bg-white pl-6"
                    placeholder="Enter Your Email"
                />
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="w-[80%] h-[14%] bg-transparent rounded-md border font-prompt  text-white hover:text-black border-[#FAFAFA] focus:border-white outline-none  hover:bg-white pl-6"
                    placeholder="Enter Your Password"
                />

                <Button onClick={signupHandle} className='font-prompt-normal bg-transparent 2xl:text-2xl xl:text-2xl lg:text-xl md:text-lg sm:text-lg text-md text-white shadow-white shadow-none w-[80%] h-[14%] border-[#FAFAFA] border-[1px] hover:border-[1px]' > SIGN UP </Button>
                <Button onClick={() => signupWithGoogleAuth()} className='flex items-center text-white shadow-white shadow-none w-[80%] h-[14%] border-[#FAFAFA] border-[1px] hover:border-[1px] hover:shadow-2xl '>
                    <span>
                        <FontAwesomeIcon className='bg-white rounded-md text-black p-1 bgcolors 2xl:w-6 2xl:h-6 2xl:mr-5 xl:w-6 xl:h-6 xl:mr-4 lg:w-5 lg:h-5 lg:mr-2 md:w-4 md:h-4 mr-3' icon={faGoogle} />
                    </span>
                    <span className='font-prompt-normal bg-transparent 2xl:text-2xl xl:text-2xl lg:text-xl md:text-lg sm:text-lg text-md'>
                        SIGN UP WITH GOOGLE
                    </span>
                </Button>
                <p onClick={() => navigate('/login')} className='signupfont text-white opacity-30 hover:opacity-100  hover:cursor-pointer'>Already Have an Account? Log In</p>


            </Card>
            <Toaster />
        </div>
    )
}

export default Signup