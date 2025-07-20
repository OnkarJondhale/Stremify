import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import AttractionsIcon from '@mui/icons-material/Attractions';

import { styled } from "@mui/system";
import { login } from "../operations/auth";

const StyledTextFields = styled(TextField)(({ theme }) => ({
    '& .MuiInputLabel-root': {
        color: 'white',
        '&.Mui-error': {
            color: 'white',
        }
    },
    '& .MuiOutlinedInput-root': {
        '& .MuiInputBase-input': {
            color: 'white',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
        },
    },
    '& .MuiFormHelperText-root': {
        color: 'white',
        '&.Mui-error': {
            color: '#f44336',
        },
    },
}));


function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onBlur"
    });

    const user = useSelector((state) => state.user);

    useEffect(() => {
        if (user) {
            navigate("/");
            return;
        }
    }, [])

    function handleLogin(data) {
        // console.log("Login data is : ", data);

        login(
            data.email,
            data.password,
            navigate,
            dispatch)
    }


    return (
        <div className="min-h-screen w-full flex justify-center items-center p-4" data-theme="forest">

            <div className="w-full max-w-4xl border-[0.08rem] border-white border-dashed flex flex-col md:flex-row shadow-lg overflow-hidden">

                <div className="w-full md:w-1/2 flex flex-col justify-center gap-2 p-6 md:p-8">
                    <div className="w-full flex gap-2 text-primary">
                        <AttractionsIcon sx={{ fontSize: 40 }} />
                        <h1 className="w-full text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"> Streamify </h1>
                    </div>

                    <p className="w-full mb-4">
                        <span className=" text-white font-medium text-xl"> Login to your account </span>
                        <br />
                        <span className="text-white text-sm"> Welcome back! Please enter your details.</span>
                    </p>

                    <form onSubmit={handleSubmit(handleLogin)} className="w-full flex flex-col gap-4" noValidate>
                        <StyledTextFields
                            id="outlined-basic-email"
                            label="Email *"
                            variant="outlined"
                            size="small"
                            fullWidth
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                        <StyledTextFields
                            id="outlined-basic-password"
                            label="Password *"
                            variant="outlined"
                            size="small"
                            fullWidth
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <div className="w-full flex justify-end">
                            <Link to='/resetpassword'>
                                <i className="text-sm underline cursor-pointer text-green-600"> forgot your password </i>
                            </Link>
                        </div>

                        <Button variant="contained" type="submit" sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' }, marginTop: '16px' }}> Login </Button>
                    </form>

                    <div className="w-full font-mono flex justify-center text-sm mt-4 text-center md:text-left">
                        <p>
                            Don't have an account? {' '}
                            <Link to="/signup" className="text-green-600 underline cursor-pointer">
                                Sign Up
                            </Link> {' '}
                            here.
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex h-full w-1/2 flex-col items-center justify-center bg-green-900 p-8">
                    <img src='signup.png' alt="Signup illustration" className="h-80 object-contain" />
                    <div className="w-full flex flex-col justify-center gap-4 items-center mt-4">
                        <h1 className="text-2xl text-center text-white font-bold font-mono"> Connect with others world-wide! </h1>
                        <p className="text-center text-lg font-mono tracking-tighter"> Make friends, <span className="text-yellow-400 underline"> chat</span> with them,have <span className="text-yellow-400 underline"> 1:1 or group </span> conversation via <span className="text-yellow-400 underline"> video call</span> and most importantly have fun!  </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Login;