import React, { useState } from 'react';
import { Box, TextField, Select, MenuItem, Button, FormControl, Paper, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface SearchHeaderProps {
    onSearch: (topic: string, difficulty: string) => void;
    loading: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearch, loading }) => {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Beginner');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && topic && !loading) {
            onSearch(topic, difficulty);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: '900px', textAlign: 'center' }}>
            <Typography variant="h2" sx={{
                mb: 4,
                fontWeight: 800,
                background: 'linear-gradient(45deg, #fff 30%, #a5b4fc 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                fontSize: { xs: '2.5rem', md: '4rem' }
            }}>
                Chart Your Knowledge.
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'center',
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
            >
                <TextField
                    variant="standard"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What do you want to learn? (e.g. React, Physics...)"
                    InputProps={{
                        disableUnderline: true,
                        sx: {
                            fontSize: '1.2rem',
                            color: '#fff',
                            pl: 2,
                            '::placeholder': { color: 'rgba(255,255,255,0.4)' }
                        }
                    }}
                    sx={{ flexGrow: 1, minWidth: '200px', py: 1 }}
                />

                <Box sx={{ height: '32px', width: '1px', bgcolor: 'rgba(255,255,255,0.1)', display: { xs: 'none', md: 'block' } }} />

                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <Select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        disableUnderline
                        sx={{
                            color: '#a5b4fc',
                            fontSize: '1rem',
                            fontWeight: 500,
                            '& .MuiSelect-icon': { color: '#a5b4fc' }
                        }}
                    >
                        <MenuItem value="Beginner">Beginner</MenuItem>
                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                        <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    onClick={() => onSearch(topic, difficulty)}
                    disabled={loading || !topic}
                    sx={{
                        borderRadius: '16px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.39)',
                        color: 'white',
                        minWidth: '140px',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 6px 20px rgba(168, 85, 247, 0.23)',
                        }
                    }}
                    startIcon={!loading && <AutoAwesomeIcon />}
                >
                    {loading ? 'Generating...' : 'Generate'}
                </Button>
            </Paper>
        </Box>
    );
};
