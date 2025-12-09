import { useState, useEffect } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Button, Snackbar, Alert, IconButton, Tooltip, Drawer } from '@mui/material';
import { Sidebar } from '../components/Sidebar';
import { SearchHeader } from '../components/SearchHeader';
import { RoadmapCanvas } from '../components/RoadmapCanvas';
import { ReferencePanel } from '../components/ReferencePanel';
import { AuthDialog } from '../components/AuthDialog';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { clearToken, roadmapApi } from '../api';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import SaveIcon from '@mui/icons-material/Save';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate, useLocation } from 'react-router-dom';

export const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [roadmapData, setRoadmapData] = useState<any>(null);
    const [currentTopic, setCurrentTopic] = useState('');
    const [currentDifficulty, setCurrentDifficulty] = useState('');

    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [authOpen, setAuthOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'info' | 'success' | 'error' | 'warning' });
    const [refreshSidebar, setRefreshSidebar] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        // Check if we were redirected with instruction to open auth
        // We can use location.state or query param. Let's support state.
        if (location.state && (location.state as any).openAuth) {
            setAuthOpen(true);
            // Clear state so it doesn't reopen on refresh if we could (React Router state persists on refresh usually, but good to consume)
            window.history.replaceState({}, document.title)
        }
    }, [location]);

    const handleLoginSuccess = (usr: any) => {
        setUser(usr);
        localStorage.setItem('user', JSON.stringify(usr));
        setSnackbar({ open: true, message: `Welcome ${usr.email}`, severity: 'success' });
    };

    const handleLogout = () => {
        setUser(null);
        clearToken();
        localStorage.removeItem('user');
        setSnackbar({ open: true, message: 'Logged out', severity: 'info' });
    };

    const handleSearch = async (topic: string, difficulty: string) => {
        setLoading(true);
        setCurrentTopic(topic);
        setCurrentDifficulty(difficulty);
        setSelectedNode(null);
        setRoadmapData(null);
        try {
            const res = await roadmapApi.generate({ topic, difficulty });
            setRoadmapData(res.data);
        } catch (err) {
            console.error('Generation Error:', err);
            setSnackbar({ open: true, message: 'Failed to generate roadmap', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            setAuthOpen(true);
            return;
        }
        if (!roadmapData) return;

        try {
            const dataToSave = roadmapData.data ? roadmapData.data : roadmapData;
            await roadmapApi.save({
                topic: currentTopic,
                difficulty: currentDifficulty,
                data: dataToSave,
                userId: user.id
            });
            setSnackbar({ open: true, message: 'Roadmap saved!', severity: 'success' });
            setRefreshSidebar(prev => prev + 1);
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 403) {
                setSnackbar({ open: true, message: err.response.data.error, severity: 'warning' });
            } else {
                setSnackbar({ open: true, message: 'Failed to save roadmap', severity: 'error' });
            }
        }
    };

    const handleSelectSavedRoadmap = (mapData: any) => {
        setRoadmapData(mapData.data);
        setCurrentTopic(mapData.topic);
        setCurrentDifficulty(mapData.difficulty);
        setSidebarOpen(false);
        setSelectedNode(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
            <CssBaseline />

            {/* Premium Tech Header */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: 'rgba(9, 9, 11, 0.6)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    zIndex: 50
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => setSidebarOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>

                        <AutoAwesomeIcon sx={{ color: '#ef5350', mr: 1 }} />
                        <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'Outfit' }}>
                            AllMaps <span style={{ opacity: 0.5, fontWeight: 400 }}>AI</span>
                        </Typography>
                    </Box>

                    <Box>
                        {roadmapData && (
                            <Tooltip title="Save to profile">
                                <IconButton color="default" onClick={handleSave} sx={{ mr: 2, '&:hover': { color: '#ef5350' } }}>
                                    <SaveIcon />
                                </IconButton>
                            </Tooltip>
                        )}

                        {user ? (
                            <Button
                                color="inherit"
                                onClick={handleLogout}
                                startIcon={<AccountCircle />}
                                sx={{ borderRadius: '20px', textTransform: 'none', px: 3, bgcolor: 'rgba(255,255,255,0.05)' }}
                            >
                                Logout
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => setAuthOpen(true)}
                                sx={{ borderRadius: '20px', textTransform: 'none', borderColor: 'rgba(255,255,255,0.2)' }}
                            >
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content - Pushed down by fixed header */}
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                pt: '64px', // Space for header
                position: 'relative'
            }}>

                {/* Search Hero Section - Animated appearance */}
                <Box sx={{
                    position: 'relative',
                    zIndex: 10,
                    pt: 4,
                    pb: 2,
                    px: 3,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <SearchHeader onSearch={handleSearch} loading={loading} />
                </Box>

                {/* Roadmap Display Area - Immersive Viewport */}
                <Box sx={{
                    flexGrow: 1,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    minHeight: '600px',
                    bgcolor: 'transparent'
                }}>
                    {roadmapData ? (
                        <Box sx={{
                            flexGrow: 1,
                            width: '100%',
                            height: '70vh' // Explicit height
                        }}>
                            <RoadmapCanvas data={roadmapData} onNodeClick={setSelectedNode} />
                        </Box>
                    ) : (
                        !loading && (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                opacity: 0.7,
                                mt: 4
                            }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#333', mb: 2, letterSpacing: '-0.03em' }}>
                                    Start Your Journey
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Enter a topic above to generate a personalized AI roadmap.
                                </Typography>
                            </Box>
                        )
                    )}

                    <LoadingOverlay open={loading} />

                    {/* Floating Reference Panel - Integrated Bottom Sheet Concept */}
                    <Box
                        id="reference-section"
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            pointerEvents: 'none', // Let clicks pass through if empty
                            p: 3,
                            display: 'flex',
                            justifyContent: 'center',
                            zIndex: 20
                        }}
                    >
                        <Box sx={{ pointerEvents: 'auto', maxWidth: '800px', width: '100%' }}>
                            <ReferencePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
                        </Box>
                    </Box>
                </Box>

            </Box>

            {/* Sidebar Drawer Implementation */}
            <Drawer
                anchor="left"
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                ModalProps={{
                    keepMounted: true, // Better performance on mobile.
                }}
                PaperProps={{
                    sx: {
                        bgcolor: 'rgba(10, 10, 12, 0.9)',
                        backdropFilter: 'blur(12px)',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        width: 320,
                    }
                }}
            >
                <Sidebar
                    user={user}
                    onSelectRoadmap={handleSelectSavedRoadmap}
                    refreshTrigger={refreshSidebar}
                />
            </Drawer>

            <AuthDialog
                open={authOpen}
                onClose={() => setAuthOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
