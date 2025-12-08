import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Tabs, Tab, Typography } from '@mui/material';
import { saveToken, authApi } from '../api';

interface AuthDialogProps {
    open: boolean;
    onClose: () => void;
    onLoginSuccess: (user: any) => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose, onLoginSuccess }) => {
    const [tab, setTab] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');
        try {
            if (tab === 0) {
                // Login
                const res = await authApi.login({ email, password });
                saveToken(res.data.access_token);
                onLoginSuccess(res.data.user);
                onClose();
            } else {
                // Signup
                await authApi.signup({ email, password });
                // Auto login after signup
                const res = await authApi.login({ email, password });
                saveToken(res.data.access_token);
                onLoginSuccess(res.data.user);
                onClose();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
                    <Tab label="Login" />
                    <Tab label="Signup" />
                </Tabs>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, mt: 2 }}>
                {error && <Typography color="error" variant="body2">{error}</Typography>}
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
                <Button variant="contained" onClick={handleSubmit}>
                    {tab === 0 ? 'Login' : 'Signup'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};
