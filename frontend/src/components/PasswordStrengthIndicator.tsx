import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordStrengthIndicatorProps {
    password: string;
}

const requirements = [
    { id: 1, label: 'At least 8 characters', regex: /.{8,}/ },
    { id: 2, label: 'At least 1 uppercase letter', regex: /[A-Z]/ },
    { id: 3, label: 'At least 1 number', regex: /[0-9]/ },
    { id: 4, label: 'At least 1 special character', regex: /[!@#$%^&*(),.?":{}|<>]/ },
];

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
    const [metRequirements, setMetRequirements] = useState<number[]>([]);

    useEffect(() => {
        const met = requirements
            .filter((req) => req.regex.test(password))
            .map((req) => req.id);
        setMetRequirements(met);
    }, [password]);

    // Calculate progress
    const progress = (metRequirements.length / requirements.length) * 100;

    // Determine color based on strength
    const getColor = () => {
        if (progress === 100) return '#4caf50'; // Green
        if (progress >= 50) return '#ff9800';   // Orange
        return '#f44336';                       // Red
    };

    return (
        <Box sx={{ mt: 1, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%`, backgroundColor: getColor() }}
                style={{ height: '4px', borderRadius: '2px', marginBottom: '16px' }}
                transition={{ duration: 0.3 }}
            />
            <List dense>
                {requirements.map((req) => {
                    const isMet = metRequirements.includes(req.id);
                    return (
                        <ListItem key={req.id} disablePadding>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <AnimatePresence mode='wait'>
                                    {isMet ? (
                                        <motion.div
                                            key="check"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        >
                                            <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="unchecked"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                        >
                                            <RadioButtonUnchecked sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </ListItemIcon>
                            <ListItemText
                                primary={req.label}
                                primaryTypographyProps={{
                                    variant: 'caption',
                                    color: isMet ? 'text.primary' : 'text.secondary',
                                    sx: { transition: 'color 0.3s ease' }
                                }}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};
