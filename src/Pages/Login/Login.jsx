import React from 'react';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Typography } from '@material-tailwind/react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate =useNavigate()

    let googleData = ''
    const LoginWithGoogleAuth = useGoogleLogin({
        onSuccess: (codeResponse) => {
            googleData = codeResponse
            console.log(googleData.access_token, 'googleDataTOken');
            GoogleAuth();
        },
        onError: (error) => {
            toast.error(error);
            console.log("Login Failed:", error);
        }
    });

    const GoogleAuth = async () => {
        // try {
        //     if (!googleData) return;
        //     const tokenData = await axios.get(
        //         `${Google_Access_Token}access_token=${googleData.access_token}`,
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${googleData.access_token}`,
        //                 Accept: "application/json",
        //             },
        //         }
        //     );
        //     const backend_access = googleData.access_token
        //     googleData = tokenData.data;
        //     const googleUser = {
        //         email: googleData.email,
        //         access_token: backend_access
        //     }
        //     try {
        //         setLoadingManage(true)
        //         const googleResponse = await axios.post(User_Google_Login, googleUser);
        //         const response = googleResponse.data
        //         if (response.status === 406) {
        //             setTimeout(() => {
        //                 toast.error(response.message)
        //             }, 500);
        //             navigate('/login')
        //         }
        //         if (response.status === 403) {
        //             setTimeout(() => {
        //                 toast.error(response.message)
        //             }, 500);
        //             navigate('/login')
        //         }
        //         if (response.status === 202) {
        //             setTimeout(() => {
        //                 toast.error(response.message)
        //             }, 500);
        //             navigate('/login')
        //         }
        //         // if already signup with form work this 

        //         if (response.status === 201) {
        //             setTimeout(() => {
        //                 toast.success(response.message)
        //             }, 500);
        //             const data = (response.token)
        //             localStorage.setItem('token', JSON.stringify(data));

        //             try {
        //                 const token = jwtDecode(data.access)
        //                 const setUser = {
        //                     "id": token.user_id,
        //                     "email": token.email,
        //                     "is_superuser": token.is_superuser,
        //                     "is_company": token.is_company,
        //                     "is_google": token.is_google,
        //                     "is_active": token.is_active,
        //                 }
        //                 dispatch(setUserDetails(setUser));
        //                 setLoadingManage(false)
        //                 if (token.is_superuser && token.is_active) {
        //                     navigate('/admin/');
        //                 }
        //                 else if (token.is_company && token.is_active) {
        //                     navigate('/company/');
        //                 }
        //                 else if (token.is_active) {
        //                     navigate('/');
        //                 }
        //                 else {
        //                     toast.error('Invalid Credentials!')
        //                     navigate('/login');
        //                 }

        //             } catch (error) {
        //                 setLoadingManage(false)
        //                 console.error('Error decoding JWT:', error);
        //             }

        //         }
        //     } catch (error) {
        //         setLoadingManage(false)
        //         console.error('Error during signup:', error);
        //         toast.error(error.message);
        //     }
        // } catch (error) {
        //     setLoadingManage(false)
        //     console.log(error.response);
        //     toast.error(error.message);
        // }
        console.log('ok ');
    };

    return (
        <div className='bg-[#000000] w-full h-[695px] flex justify-center '>
            <Card className='bg-transparent  h-[60%] 2xl:w-[35%] xl:w-[40%] lg:w-[40%] md:w-[50%] 2xl:mt-40 xl:mt-28 lg:mt-24 md:mt-20 sm:mt-14 mt-10 w-[90%] sm:w-[80%] flex flex-col justify-center shadow-none items-center rounded-lg gap-5'>
                <Typography className='font-prompt text-[#FAFAFA] text-3xl 2xl:absolute 2xl:-top-5'>LOGIN</Typography>
                <input
                    type="text"
                    className="w-[80%] h-[14%] bg-transparent rounded-md border font-prompt   text-white hover:text-black border-[#FAFAFA] focus:border-white outline-none  hover:bg-white pl-6"
                    placeholder="Enter Your Email"
                />
                <input
                    type="password"
                    className="w-[80%] h-[14%] bg-transparent rounded-md border font-prompt  text-white hover:text-black border-[#FAFAFA] focus:border-white outline-none  hover:bg-white pl-6"
                    placeholder="Enter Your Password"
                />
                <Button className='font-prompt-normal bg-transparent 2xl:text-2xl xl:text-2xl lg:text-xl md:text-lg sm:text-lg text-md text-white shadow-white shadow-none w-[80%] h-[14%] border-[#FAFAFA] border-[1px] hover:border-[1px]' > LOGIN </Button>
                <Button onClick={() => LoginWithGoogleAuth()} className='flex items-center text-white shadow-white shadow-none w-[80%] h-[14%] border-[#FAFAFA] border-[1px] hover:border-[1px] hover:shadow-2xl '>
                    <span>
                        <FontAwesomeIcon className='bg-white rounded-md text-black p-1 bgcolors 2xl:w-6 2xl:h-6 2xl:mr-5 xl:w-6 xl:h-6 xl:mr-4 lg:w-5 lg:h-5 lg:mr-2 md:w-4 md:h-4 mr-3' icon={faGoogle} />
                    </span>
                    <span className='font-prompt-normal bg-transparent 2xl:text-2xl xl:text-2xl lg:text-xl md:text-lg sm:text-lg text-md'>
                        SIGN IN WITH GOOGLE
                    </span>
                </Button>
                <p onClick={() => navigate('/signup')} className='signupfont text-white opacity-30 hover:opacity-100  hover:cursor-pointer'>New User? Get Started Here</p>


            </Card>

        </div>
    )
}

export default Login