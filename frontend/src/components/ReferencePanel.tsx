import React from 'react';
import { Box, Typography, Link, Paper, Divider, Fade, IconButton } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';

interface ReferencePanelProps {
    node: any | null;
    onClose: () => void;
}

export const ReferencePanel: React.FC<ReferencePanelProps> = ({ node, onClose }) => {
    if (!node) return null;

    return (
        <Fade in={!!node}>
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    borderRadius: '24px',
                    background: 'rgba(30, 30, 35, 0.85)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
                    color: 'white',
                    maxWidth: '100%',
                    position: 'relative'
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 16, right: 16, color: 'text.secondary' }}
                >
                    <CloseIcon />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                        p: 1,
                        borderRadius: '12px',
                        bgcolor: 'rgba(239, 68, 68, 0.15)',
                        display: 'flex',
                        mr: 2
                    }}>
                        <ArticleIcon sx={{ color: '#ef4444' }} />
                    </Box>
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.1em', fontWeight: 600 }}>
                        Step Details
                    </Typography>
                </Box>

                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, fontFamily: 'Outfit' }}>
                    {node.label}
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                    {node.description}
                </Typography>

                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                    Featured Resources
                    <Box component="span" sx={{ ml: 1, fontSize: '0.8em', opacity: 0.5, bgcolor: 'rgba(255,255,255,0.1)', px: 1, borderRadius: '4px' }}>
                        {node.references?.length || 0}
                    </Box>
                </Typography>

                {node.references && node.references.length > 0 ? (
                    <Box component="ul" sx={{ pl: 0, m: 0, listStyle: 'none', display: 'grid', gap: 2 }}>
                        {node.references.map((ref: any, idx: number) => (
                            <li key={idx}>
                                <Paper
                                    component={Link}
                                    href={ref.url}
                                    target="_blank"
                                    rel="noopener"
                                    elevation={0}
                                    sx={{
                                        display: 'block',
                                        p: 2,
                                        borderRadius: '12px',
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.08)',
                                            transform: 'translateX(4px)',
                                            borderColor: 'rgba(255,255,255,0.2)'
                                        }
                                    }}
                                >
                                    <Typography variant="subtitle2" sx={{ color: '#a5b4fc', fontWeight: 600 }}>
                                        {ref.title || new URL(ref.url).hostname}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontFamily: 'monospace' }}>
                                        {ref.url}
                                    </Typography>
                                </Paper>
                            </li>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No specific references available for this step.
                    </Typography>
                )}
            </Paper>
        </Fade>
    );
};
