import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#bb86fc', // Using a nice purple for primary
        },
        secondary: {
            main: '#03dac6', // Teal for secondary
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        }
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Remove uppercase default
                }
            }
        }
    }
});
