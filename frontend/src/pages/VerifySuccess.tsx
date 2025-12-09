import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Check, ArrowForward, Login, Map } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const VerifySuccess = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#121212', // Dark background
                color: '#ffffff',
                p: 2,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Glow Effect */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60vw',
                    height: '60vw',
                    background: 'radial-gradient(circle, rgba(187,134,252,0.1) 0%, rgba(18,18,18,0) 70%)',
                    borderRadius: '50%',
                    zIndex: 0,
                    pointerEvents: 'none'
                }}
            />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3
                    }}
                >
                    {/* Hero Text with Bounce In */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffffff', mb: 1, letterSpacing: '-0.02em', fontFamily: 'Outfit' }}>
                            Email Verified Successfully!
                        </Typography>
                    </motion.div>

                    {/* Central Animation */}
                    <Box sx={{ position: 'relative', width: 200, height: 200, my: 4 }}>
                        {/* Spinning Map Element/Background */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.15 }}
                        >
                            <Map sx={{ fontSize: 200, color: '#bb86fc' }} />
                        </motion.div>

                        {/* Envelope/Check Animation */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.1, 1] }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '50%',
                                width: 120,
                                height: 120,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(187,134,252,0.3)',
                                boxShadow: '0 0 30px rgba(187,134,252,0.2)',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                marginTop: -60,
                                marginLeft: -60
                            }}
                        >
                            <motion.div
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <Check sx={{ fontSize: 60, color: '#bb86fc' }} />
                            </motion.div>
                        </motion.div>

                        {/* Floating Particles */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: [0, 0.8, 0],
                                    scale: [0, 1.2],
                                    x: Math.cos(i * 45 * (Math.PI / 180)) * 100,
                                    y: Math.sin(i * 45 * (Math.PI / 180)) * 100
                                }}
                                transition={{ duration: 2, delay: 0.6 + Math.random() * 0.5, repeat: Infinity, repeatDelay: 1 + Math.random() }}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: '#bb86fc',
                                    marginTop: -3,
                                    marginLeft: -3
                                }}
                            />
                        ))}
                    </Box>

                    {/* Subtext */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Typography variant="h6" sx={{ maxWidth: 500, mx: 'auto', fontWeight: 'normal', color: 'rgba(255,255,255,0.7)' }}>
                            Your journey begins now. Access your personalized roadmaps and start charting your knowledge.
                        </Typography>
                    </motion.div>

                    {/* CTA Buttons - Using user instructed text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}
                    >
                        {/* We could rely on just one button if the user wants "Go to Allmaps and Login" flow.
                            Let's offer the direct actions. */}

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => {
                                navigate('/', { state: { openAuth: true } });
                            }}
                            startIcon={<Login />}
                            sx={{
                                bgcolor: '#bb86fc',
                                color: '#000', // Black text on purple is high contrast
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#9965f4', transform: 'scale(1.05)' },
                                transition: 'all 0.2s',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                borderRadius: '12px'
                            }}
                        >
                            Go to Allmaps & Login Now
                        </Button>
                    </motion.div>

                    {/* Footer */}
                    <Box sx={{ mt: 8, opacity: 0.4 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            Verified on {new Date().toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};
