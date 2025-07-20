import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AttractionsIcon from '@mui/icons-material/Attractions';

import { styled } from "@mui/system";

// This styled component is reused for brand consistency.
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


function ResetPassword() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onBlur"
    });

    function handlePasswordReset(data) {
        console.log("Sending password reset link to:", data.email);
        
    }

    return (
        <div className="min-h-screen w-full flex justify-center items-center p-4">

            <div className="w-full max-w-lg border-[0.08rem] border-white border-dashed flex flex-col shadow-lg overflow-hidden p-6 md:p-10">

                <div className="w-full flex flex-col justify-center items-center gap-4">
                    <div className="w-full flex gap-2 justify-center text-primary">
                        <AttractionsIcon sx={{ fontSize: 40 }} />
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"> Streamify </h1>
                    </div>

                    <Typography variant="h6" sx={{ color: 'white', mt: 2 }}>
                        Forgot Your Password?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
                        No worries, we'll send you reset instructions. Please enter the email address associated with your account.
                    </Typography>

                    <Box 
                        component="form" 
                        onSubmit={handleSubmit(handlePasswordReset)} 
                        sx={{ mt: 3, width: '100%' }}
                        noValidate
                    >
                        <StyledTextFields
                            id="reset-email"
                            label="Email Address *"
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
                        >
                            Send Reset Link
                        </Button>
                    </Box>

                    <div className="w-full font-mono flex justify-center text-sm mt-2 text-center">
                         <Link to="/login" className="text-gray-400 underline cursor-pointer">
                                Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
