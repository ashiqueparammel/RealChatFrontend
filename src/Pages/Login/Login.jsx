import { Button, Card, Typography } from '@material-tailwind/react'
import React from 'react'

function Login() {

    return (
        <div className='bg-[#000000]  w-full h-[695px] flex justify-center '>
            <Card className='bg-transparent  h-[60%] 2xl:w-[35%] xl:w-[40%] lg:w-[40%] md:w-[50%] 2xl:mt-40 xl:mt-28 lg:mt-24 md:mt-20 sm:mt-14 mt-10 w-[90%] sm:w-[80%] flex flex-col justify-center shadow-none items-center rounded-lg gap-5'>
                <Typography className='font-prompt text-[#FAFAFA] text-3xl 2xl:absolute 2xl:top-5'>LOGIN</Typography>
                <input
                    type="text"
                    className="w-[80%] h-[14%] bg-transparent rounded-md border  text-white hover:text-black border-[#FAFAFA] focus:border-transparent outline-none  hover:bg-white pl-6"
                    placeholder="Enter Your Email"
                />
                <input
                    type="text"
                    className="w-[80%] h-[14%] bg-transparent rounded-md border  text-white hover:text-black border-[#FAFAFA] focus:border-transparent outline-none  hover:bg-white pl-6"
                    placeholder="Enter Your Password"
                />
                <Button className='font-prompt-normal bg-transparent text-white shadow-white shadow-none w-[80%] h-[14%] border-[#FAFAFA] border-[1px] hover:border-[0px]' > LOGIN </Button>
                <Button className='font-prompt-normal bg-transparent text-white shadow-white shadow-none w-[80%] h-[14%] border-[#FAFAFA] border-[1px] hover:border-[0px]' ><span><i className="fa-brands fa-google w-5 h-5"></i></span> SIGN IN WITH GOOGLE </Button>
            </Card>

        </div>
    )
}

export default Login