import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Skeleton, Stack, alpha } from '@mui/material';
import { roadmapApi } from '../api';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MapIcon from '@mui/icons-material/Map';
import SchoolIcon from '@mui/icons-material/School';

interface SidebarProps {
    user: any;
    onSelectRoadmap: (roadmap: any) => void;
    refreshTrigger: number;
}

const DifficultyBadge = ({ level }: { level: string }) => {
    let color = '#a1a1aa';
    let bg = 'rgba(255,255,255,0.05)';

    const lower = (level || '').toLowerCase();
    if (lower === 'beginner') {
        color = '#4ade80';
        bg = 'rgba(74, 222, 128, 0.1)';
    } else if (lower === 'intermediate') {
        color = '#fbbf24';
        bg = 'rgba(251, 191, 36, 0.1)';
    } else if (lower === 'advanced') {
        color = '#f87171';
        bg = 'rgba(248, 113, 113, 0.1)';
    }

    return (
        <Chip
            label={level || 'N/A'}
            size="small"
            sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 600,
                color: color,
                bgcolor: bg,
                border: `1px solid ${alpha(color, 0.2)}`,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}
        />
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ user, onSelectRoadmap, refreshTrigger }) => {
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setLoading(true);
            roadmapApi.getUserRoadmaps(user.id)
                .then(res => setRoadmaps(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setRoadmaps([]);
        }
    }, [user, refreshTrigger]);

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            overflow: 'hidden'
        }}>
            {/* Header Section */}
            <Box sx={{
                p: 3,
                pb: 2,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)'
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 700,
                    fontFamily: 'Outfit',
                    letterSpacing: '-0.01em',
                    background: 'linear-gradient(to right, #fff, #a1a1aa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <MapIcon sx={{ color: '#ef5350', fontSize: 20 }} />
                    Your Concept Maps
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    {user ? `${roadmaps.length} Saved Maps` : 'Log in to view maps'}
                </Typography>
            </Box>

            {/* List Section */}
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }
            }}>
                {!user ? (
                    <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                        <SchoolIcon sx={{ fontSize: 40, mb: 2, opacity: 0.5 }} />
                        <Typography variant="body2">
                            Please login to access and manage your saved roadmaps.
                        </Typography>
                    </Box>
                ) : loading ? (
                    [1, 2, 3].map(i => (
                        <Skeleton key={i} variant="rectangular" height={80} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
                    ))
                ) : roadmaps.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                        <Typography variant="body2">No maps saved yet.</Typography>
                    </Box>
                ) : (
                    roadmaps.map((map) => (
                        <Box
                            key={map.id}
                            onClick={() => onSelectRoadmap(map)}
                            sx={{
                                position: 'relative',
                                p: 2,
                                borderRadius: 3,
                                bgcolor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                transition: 'all 0.2s ease-in-out',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.06)',
                                    transform: 'translateY(-2px)',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                                    '& .arrow-icon': {
                                        opacity: 1,
                                        transform: 'translateX(0)'
                                    }
                                },
                                '&:active': {
                                    transform: 'scale(0.98)'
                                },
                            }}
                        >
                            {/* Decorative gradient blob */}
                            <Box sx={{
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 60,
                                height: 60,
                                background: 'radial-gradient(circle, rgba(239, 83, 80, 0.15) 0%, rgba(0,0,0,0) 70%)',
                                borderRadius: '50%',
                                pointerEvents: 'none'
                            }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    lineHeight: 1.3,
                                    color: '#f4f4f5',
                                    pr: 1
                                }}>
                                    {map.topic}
                                </Typography>
                                {map.created_at && (
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>
                                        {new Date(map.created_at).toLocaleDateString()}
                                    </Typography>
                                )}
                            </Box>

                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <DifficultyBadge level={map.difficulty} />
                                <ChevronRightIcon className="arrow-icon" sx={{
                                    fontSize: 16,
                                    color: 'rgba(255,255,255,0.5)',
                                    opacity: 0.5,
                                    transform: 'translateX(-5px)',
                                    transition: 'all 0.2s ease'
                                }} />
                            </Stack>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};
