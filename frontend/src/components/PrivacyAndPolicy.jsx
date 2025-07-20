import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AttractionsIcon from '@mui/icons-material/Attractions';

function PrivacyPolicyModal({ isModalOpen, onClose }) {

    return (
        <Dialog
            onClose={onClose}
            open={isModalOpen}
            fullWidth={true}
            maxWidth="sm" 
            BackdropProps={{
                style: {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                    backdropFilter: 'blur(3px)',
                },
            }}
            PaperProps={{
                sx: {
                    backgroundColor: '#1a241c',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    backgroundImage: 'none',
                }
            }}
        >
            <DialogTitle sx={{ p: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AttractionsIcon sx={{ color: '#6ee7b7' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold',color: '#6ee7b7' }}>
                            Streamify
                        </Typography>
                    </div>
                    <IconButton aria-label="close" onClick={onClose} sx={{ color: 'grey.500' }}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.23)' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Privacy Policy
                </Typography>
                
                <Typography gutterBottom variant="h6" sx={{ color: '#6ee7b7', mt: 2 }}>1. Information We Collect</Typography>
                <Typography gutterBottom>
                    We collect information you provide directly to us, such as when you create an account: your name, email address, and password.
                </Typography>

                <Typography gutterBottom variant="h6" sx={{ color: '#6ee7b7', mt: 2 }}>2. How We Use Your Information</Typography>
                <Typography gutterBottom>
                    Your information is used to operate and maintain the Service. We do not sell your personal data. Your chat and video call contents are confidential.
                </Typography>

                <Typography gutterBottom variant="h6" sx={{ color: '#6ee7b7', mt: 2 }}>3. Data Security</Typography>
                <Typography gutterBottom>
                    We use commercially reasonable safeguards to help keep the information collected through the Service secure. However, no data transmission is 100% secure.
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button 
                    onClick={onClose} 
                    sx={{ color: 'white', borderColor: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }} 
                    variant="outlined"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PrivacyPolicyModal;