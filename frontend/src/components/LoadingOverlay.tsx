import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

interface LoadingOverlayProps {
    open: boolean;
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ open, message = 'Generating Roadmap...' }) => {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                flexDirection: 'column',
                gap: 2
            }}
            open={open}
        >
            <CircularProgress color="inherit" size={60} thickness={4} />
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" component="div">
                    {message}
                </Typography>
            </Box>
        </Backdrop>
    );
};
