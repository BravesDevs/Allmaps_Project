import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { ErrorOutline, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const VerifyError = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#121212',
                color: '#ffffff',
                p: 2
            }}
        >
            <Container maxWidth="sm">
                <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring' }}
                    >
                        <ErrorOutline sx={{ fontSize: 100, color: '#cf6679' }} /> {/* Standard Material Dark Error Color */}
                    </motion.div>

                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#cf6679', fontFamily: 'Outfit' }}>
                        Verification Failed
                    </Typography>

                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'normal' }}>
                        The verification link is invalid or has expired.
                    </Typography>

                    <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                        startIcon={<Home />}
                        sx={{
                            mt: 2,
                            borderColor: '#cf6679',
                            color: '#cf6679',
                            '&:hover': {
                                borderColor: '#ff8a80',
                                backgroundColor: 'rgba(207, 102, 121, 0.08)'
                            }
                        }}
                    >
                        Return Home
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};
