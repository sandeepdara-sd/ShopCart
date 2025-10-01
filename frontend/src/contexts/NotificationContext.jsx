import { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Slide, Grow } from '@mui/material';

const NotificationContext = createContext(null);

function TransitionComponent(props) {
  return <Slide {...props} direction="up" />;
}

export function NotificationProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info', duration: 3000 });

  const notify = useCallback((message, options = {}) => {
    setSnackbar({
      open: true,
      message,
      severity: options.severity || 'info',
      duration: options.duration || 3000,
    });
  }, []);

  const handleClose = () => setSnackbar((s) => ({ ...s, open: false }));

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={TransitionComponent}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
          }
        }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            alignItems: 'center',
            borderRadius: 2,
            boxShadow: 3,
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);
  return ctx?.notify || (() => {});
}


