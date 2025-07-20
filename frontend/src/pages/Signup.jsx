import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import TermsModal from "../components/Terms";
import PrivacyPolicyModal from "../components/PrivacyAndPolicy";

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AttractionsIcon from '@mui/icons-material/Attractions';
import Box from '@mui/material/Box';

import { styled } from "@mui/system";

import { sendOtp } from "../operations/auth";
import { setAuthData } from "../redux/slices/auth.slice"


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


function Signup() {
    const [termsModal, setTermsModal] = useState(false);
    const [privacyModal, setPrivacyModal] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state)=>state.user);

    if(user)
    {
        navigate("/");
        return;
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onBlur"
    });

    async function handlesignup(data) {
        // console.log("Data from signup form is : ", data);

        dispatch(setAuthData(data));
        sendOtp(data.email,navigate);     
    }

    return (
        <div className="min-h-screen w-full flex justify-center items-center p-4">

            <TermsModal isModalOpen={termsModal} onClose={() => setTermsModal(false)} />
            <PrivacyPolicyModal isModalOpen={privacyModal} onClose={() => setPrivacyModal(false)} />

            <div className="w-full max-w-4xl border-[0.08rem] border-white border-dashed flex flex-col md:flex-row shadow-lg overflow-hidden">

                <div className="w-full md:w-1/2 flex flex-col justify-center gap-2 p-6 md:p-8">
                    <div className="w-full flex gap-2 text-primary">
                        <AttractionsIcon sx={{ fontSize: 40 }} />
                        <h1 className="w-full text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"> Streamify </h1>
                    </div>
                    <p className="w-full mb-4">
                        <span className=" text-white font-medium text-xl"> Create an account </span>
                        <br />
                        <span className="text-white text-sm"> Signup for an exciting journey !</span>
                    </p>

                    <form onSubmit={handleSubmit(handlesignup)} className="w-full flex flex-col gap-4" noValidate>
                        <StyledTextFields
                            id="outlined-basic-fullName"
                            label="Full Name *"
                            variant="outlined"
                            size="small"
                            fullWidth
                            {...register("fullName", { required: "Full name is required" })}
                            error={!!errors.fullName}
                            helperText={errors.fullName?.message}
                        />
                        <StyledTextFields
                            id="outlined-basic-email"
                            label="Email *"
                            variant="outlined"
                            size="small"
                            fullWidth
                            type="email"
                            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
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
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                            error={!!errors.password}
                            helperText={errors.password?.message || "Password must be at least 6 characters long"}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', marginTop: '8px' }}>
                            <Checkbox
                                sx={{
                                    color: "white",
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    marginRight: '8px',
                                    "&.Mui-checked": {
                                        color: "white",
                                    },
                                }}
                                {...register("agree", {
                                    required: "You must agree to the terms and privacy policy",
                                })}
                            />
                            <Typography variant="body2" sx={{ color: 'white', paddingTop: '2px' }}>
                                I agree to the{' '}
                                <span
                                    className="text-green-400 underline cursor-pointer"
                                    onClick={() => setTermsModal(true)}
                                >
                                    terms
                                </span>{' '}
                                and{' '}
                                <span
                                    className="text-green-400 underline cursor-pointer"
                                    onClick={() => setPrivacyModal(true)}
                                >
                                    privacy policies
                                </span>
                                <span> * </span>
                            </Typography>
                        </Box>

                        {errors.agree && (
                            <Typography variant="caption" sx={{ color: "#f44336", marginLeft: "6px", display: 'block', mt: -1 }}>
                                {errors.agree.message}
                            </Typography>
                        )}

                        <Button variant="contained" type="submit" sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' }, marginTop: '16px' }}> Create Account </Button>
                    </form>

                    <div className="w-full font-mono flex justify-center text-sm mt-4 text-center md:text-left">
                        <p>
                            Already have an account? {' '}
                            <Link to="/login" className="text-green-600 underline cursor-pointer">
                                Login
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

export default Signup;