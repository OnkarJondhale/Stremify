import { useRef, useState,useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Avatar from '@mui/material/Avatar';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import AttractionsIcon from '@mui/icons-material/Attractions';
import EditIcon from '@mui/icons-material/Edit';

import { onboarding } from '../operations/auth';

const StyledTextFields = styled(TextField)(({ theme }) => ({
    '& .MuiInputLabel-root': {
        color: 'white',
        '&.Mui-error': { color: 'white' }
    },
    '& .MuiOutlinedInput-root': {
        '& .MuiInputBase-input': { color: 'white' },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
        '& .MuiSvgIcon-root': { color: 'white' }
    },
    '& .MuiFormHelperText-root.Mui-error': { color: '#f44336' },
}));

const predefinedInterests = ['Gaming', 'Music', 'Movies', 'Reading', 'Traveling', 'Cooking', 'Sports', 'Art', 'Technology', 'Fashion', 'Photography', 'Fitness'];
const languages = ['English', 'Spanish', 'Marathi', 'Hindi', 'French', 'Arabic', 'Russian', 'Portuguese', 'German', 'Japanese'];
const countries = ['United States', 'India', 'China', 'Brazil', 'United Kingdom', 'Canada'];

function Onboarding() {
    const [avatarPreview, setAvatarPreview] = useState('https://avatar.iran.liara.run/public');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: { nativeLanguage: null, proficientLanguages: [], interests: [], dob: null }
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            setValue('file', file);
        }
    };

    const onSubmit = (data) => {
        console.log("Onboarding Form Data:", data);

        onboarding(data,navigate,dispatch);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="min-h-screen w-full flex justify-center items-center p-4" >
                <div className="w-full max-w-4xl border-[0.08rem] border-white border-dashed flex flex-col shadow-lg overflow-hidden p-6 md:p-8 my-4">

                    <Box className="flex justify-between items-center w-full mb-4">
                        <div className="flex items-center gap-2 text-primary">
                            <AttractionsIcon sx={{ fontSize: { xs: 30, md: 36 } }} />
                            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                Streamify
                            </h1>
                        </div>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Box className="flex justify-center mb-6">
                            <Box sx={{ position: 'relative' }}>
                                <Avatar src={avatarPreview} sx={{ width: 100, height: 100, border: '2px solid white' }} />
                                <input type="file" accept="image/*" ref={fileInputRef} hidden onChange={handleAvatarChange} />
                                <IconButton
                                    sx={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' } }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <EditIcon sx={{ color: 'white', fontSize: '1rem' }} />
                                </IconButton>
                            </Box>
                        </Box>

                        <Typography variant="h6" sx={{ color: '#6ee7b7', mb: 2, borderBottom: '1px solid rgba(255,255,255,0.3)', pb: 1 }}>General Information</Typography>
                        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                            <StyledTextFields label="Username" fullWidth {...register('username')} />
                            <Controller name="dob" control={control} render={({ field }) => (<DatePicker
                                {...field}
                                label="Date of Birth"
                                enableAccessibleFieldDOMStructure={false}
                                slots={{ textField: (params) => <StyledTextFields {...params} fullWidth /> }}
                                slotProps={{
                                    popper: {
                                        modifiers: [
                                            {
                                                name: 'preventOverflow',
                                                options: {
                                                    boundary: 'viewport',
                                                },
                                            },
                                        ],
                                    },
                                }}
                            />
                            )} />
                            <StyledTextFields type="Number" inputProps={{ inputMode: 'numeric' }} label="Phone Number" fullWidth {...register('phone', { pattern: { value: /^[0-9]*$/, message: 'Please enter only digits' } })} error={!!errors.phone} helperText={errors.phone?.message} />

                            <StyledTextFields label="Address" fullWidth className="lg:col-span-2" {...register('address')} />
                            <Controller name="country" control={control} render={({ field }) => (<Autocomplete {...field} options={countries} value={field.value || null} onChange={(_, data) => field.onChange(data)} renderInput={(params) => <StyledTextFields {...params} label="Country" />} />)} />

                            <StyledTextFields label="Bio" fullWidth multiline rows={3} className="md:col-span-2 lg:col-span-3" {...register('bio')} />
                        </Box>

                        <Typography variant="h6" sx={{ color: '#6ee7b7', mt: 4, mb: 2, borderBottom: '1px solid rgba(255,255,255,0.3)', pb: 1 }}>Language </Typography>
                        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <Controller
                                name="nativeLanguage"
                                control={control}
                                rules={{ required: "Native Language is required" }}
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        {...field}
                                        options={languages}
                                        value={field.value || null}
                                        onChange={(_, data) => field.onChange(data)}
                                        renderInput={(params) => (
                                            <StyledTextFields
                                                {...params}
                                                label="Native Language *"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                )}
                            />

                            <Controller
                                name="proficientLanguages"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        multiple
                                        {...field}
                                        options={languages}
                                        value={field.value || []}
                                        onChange={(_, data) => field.onChange(data)}
                                        renderInput={(params) => (
                                            <StyledTextFields {...params} label="Proficient Languages" />
                                        )}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => {
                                                const { key, ...rest } = getTagProps({ index });
                                                return (
                                                    <Chip
                                                        key={key}
                                                        {...rest}
                                                        label={option}
                                                        sx={{ color: 'white', borderColor: 'white' }}
                                                    />
                                                );
                                            })
                                        }

                                    />
                                )}
                            />
                        </Box>

                        <Typography variant="h6" sx={{ color: '#6ee7b7', mt: 4, mb: 2, borderBottom: '1px solid rgba(255,255,255,0.3)', pb: 1 }}>Interests</Typography>
                        <Controller
                            name="interests"
                            control={control}
                            rules={{ required: 'Please select at least one interest' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Box className="flex flex-wrap gap-2 mt-3">
                                        {predefinedInterests.map((interest) => {
                                            const selected = field.value.includes(interest);
                                            return (
                                                <Chip
                                                    key={interest}
                                                    label={interest}
                                                    clickable
                                                    onClick={() => {
                                                        const updated = selected
                                                            ? field.value.filter((i) => i !== interest)
                                                            : [...field.value, interest];
                                                        field.onChange(updated);
                                                    }}
                                                    sx={{
                                                        color: selected ? 'black' : 'white',
                                                        backgroundColor: selected ? '#6ee7b7' : 'transparent',
                                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                                        '&:hover': {
                                                            backgroundColor: selected
                                                                ? '#5ce1a7'
                                                                : 'rgba(255, 255, 255, 0.1)',
                                                        },
                                                    }}
                                                    variant={selected ? 'filled' : 'outlined'}
                                                />
                                            );
                                        })}
                                    </Box>
                                    {fieldState.error && (
                                        <Typography variant="caption" color="#f44336" sx={{ mt: 1, display: 'block' }}>
                                            {fieldState.error.message}
                                        </Typography>
                                    )}
                                </>
                            )}
                        />

                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 4, backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' }, py: 1.5, fontSize: '1rem' }}>
                            Save Profile
                        </Button>
                    </Box>
                </div>
            </div>
        </LocalizationProvider>
    );
}

export default Onboarding;