import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AttractionsIcon from "@mui/icons-material/Attractions";

import { styled } from "@mui/system";

import { signup, sendOtp } from "../operations/auth";

const StyledOtpInput = styled(TextField)(() => ({
    width: "12vw",
    maxWidth: "45px",
    minWidth: "36px",
    backgroundColor: "transparent",
    "& .MuiInputBase-input": {
        color: "white",
        textAlign: "center",
        fontSize: "1.25rem",
        padding: "10px 12px",
    },
    "& .MuiOutlinedInput-root": {
        backgroundColor: "transparent",
        "& fieldset": {
            borderColor: "white",
        },
        "&:hover fieldset": {
            borderColor: "white",
        },
        "&.Mui-focused fieldset": {
            borderColor: "white",
        },
    },
    "& .MuiInputBase-root": {
        backgroundColor: "transparent",
    },
}));

function Otp() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authData = useSelector((state) => state.auth);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        function isValid() {
            if (!authData) {
                navigate("/login");
                return null;
            }
        }

        isValid();
    })

    useEffect(() => {
        if (timer === 0) return;

        const intervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timer]);


    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendOtp = () => {
        if (timer === 0) {
            sendOtp(authData.email,navigate);     
            setTimer(30);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const enteredOtp = otp.join("");

        signup({
            email: authData.email,
            password: authData.password,
            fullName: authData.fullName,
            otp: enteredOtp,
        }, navigate, dispatch);
    };


    return (
        <div className="min-h-screen w-full flex justify-center items-center p-4" >
            <div className="w-full max-w-lg border-[0.08rem] border-white border-dashed flex flex-col shadow-lg overflow-hidden p-6 md:p-10">
                <div className="w-full flex flex-col justify-center items-center gap-4">
                    <div className="w-full flex gap-2 justify-center text-primary">
                        <AttractionsIcon sx={{ fontSize: 40 }} />
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Streamify
                        </h1>
                    </div>

                    <Typography variant="h5" sx={{ color: "white", mt: 2 }}>
                        OTP Verification
                    </Typography>
                    <Typography variant="body2" sx={{ color: "white", textAlign: "center" }}>
                        Enter the 6-digit code sent to your email address.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", mb: 3 }}>
                            {otp.map((data, index) => (
                                <StyledOtpInput
                                    key={index}
                                    type="text"
                                    value={data}
                                    onChange={(e) => handleOtpChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    inputRef={(el) => (inputRefs.current[index] = el)}
                                    inputProps={{ maxLength: 1 }}
                                />
                            ))}
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ backgroundColor: "green", "&:hover": { backgroundColor: "darkgreen" } }}
                        >
                            Verify OTP
                        </Button>
                    </Box>

                    <div className="w-full font-mono flex flex-col items-center text-sm mt-4 text-center">
                        <p>
                            Didn't receive the code?{" "}
                            <button
                                onClick={handleResendOtp}
                                disabled={timer > 0}
                                className="text-green-600 underline cursor-pointer disabled:text-gray-500 disabled:no-underline"
                            >
                                {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                            </button>
                        </p>
                        <Link to="/login" className="text-gray-400 underline cursor-pointer mt-4">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Otp;