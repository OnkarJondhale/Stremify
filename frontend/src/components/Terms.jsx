import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AttractionsIcon from '@mui/icons-material/Attractions';

function TermsModal({ isModalOpen, onClose }) {

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
                    Terms of Service
                </Typography>
                
                <Typography gutterBottom variant="h6" sx={{ color: '#6ee7b7', mt: 2 }}>1. User Conduct</Typography>
                <Typography gutterBottom>
                    You agree not to use the Service to post or transmit any material which is threatening, defamatory, obscene, indecent, seditious, offensive, pornographic, or abusive.
                </Typography>

                <Typography gutterBottom variant="h6" sx={{ color: '#6ee7b7', mt: 2 }}>2. Chat and Video Calls</Typography>
                <Typography gutterBottom>
                    You are solely responsible for your interactions with other users. Any recording of calls without the explicit consent of all participants is strictly prohibited.
                </Typography>

                <Typography gutterBottom variant="h6" sx={{ color: '#6ee7b7', mt: 2 }}>3. Termination</Typography>
                <Typography gutterBottom>
                    We may terminate or suspend your access to our Service immediately, without prior notice or liability, if you breach the Terms.
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

export default TermsModal;