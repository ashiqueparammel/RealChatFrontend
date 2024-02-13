import React from 'react';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Typography } from '@material-tailwind/react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate()
    return (
        <div className='bg-[#000000] w-full h-[695px] flex justify-center '>
            <Card className='bg-transparent  h-[60%] 2xl:w-[35%] xl:w-[40%] lg:w-[40%] md:w-[50%] 2xl:mt-40 xl:mt-28 lg:mt-24 md:mt-20 sm:mt-14 mt-10 w-[90%] sm:w-[80%] flex flex-col justify-center shadow-none items-center rounded-lg gap-5'>
                <Typography className='font-prompt text-[#FAFAFA] text-3xl 2xl:absolute 2xl:-top-5'>SIGN UP</Typography>
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
                <Button className='font-prompt-normal bg-transparent 2xl:text-2xl xl:text-2xl lg:text-xl md:text-lg sm:text-lg text-md text-white shadow-white shadow-none w-[80%] h-[14%] border-[#FAFAFA] border-[1px] hover:border-[1px]' > SIGN UP </Button>
                <Button onClick={() => LoginWithGoogleAuth()} className='flex items-center text-white shadow-white shadow-none w-[80%] h-[14%] border-[#FAFAFA] border-[1px] hover:border-[1px] hover:shadow-2xl '>
                    <span>
                        <FontAwesomeIcon className='bg-white rounded-md text-black p-1 bgcolors 2xl:w-6 2xl:h-6 2xl:mr-5 xl:w-6 xl:h-6 xl:mr-4 lg:w-5 lg:h-5 lg:mr-2 md:w-4 md:h-4 mr-3' icon={faGoogle} />
                    </span>
                    <span className='font-prompt-normal bg-transparent 2xl:text-2xl xl:text-2xl lg:text-xl md:text-lg sm:text-lg text-md'>
                        SIGN UP WITH GOOGLE
                    </span>
                </Button>
                <p onClick={() => navigate('/login')} className='signupfont text-white opacity-30 hover:opacity-100  hover:cursor-pointer'>Already Have an Account? Log In</p>


            </Card>

        </div>
    )
}

export default Signup