import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import firebase from 'firebase/compat/app';
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import './App.css';
import { mainListItemsTeacher } from './components/listItems';
import Classroom from "./routes/Classroom";
import Home from "./routes/Home";
import Settings from "./routes/Settings";
import { SignInScreen } from './utils/firebase';
import { syncUsers } from "./utils/mutations";
import ClassroomSidebar from './components/ClassroomSidebar';

// MUI styling constants

const drawerWidth = 240;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1
}));

const mdTheme = createTheme({
  palette: {
    primary: {
      main: '#5299f0',
    },
    secondary: {
      main: '#94a7ff',
    },
  },
});

// App.js is the homepage and handles top-level functions like user auth.

export default function App() {

  // User authentication functionality.
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  // Listen to the Firebase Auth state and set the local state.
  React.useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
      if (!!user) {
        setCurrentUser(user);
        syncUsers(user);
      }
    });
    return () => unregisterAuthObserver();
    // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <Typography
              component={Link}
              to="/"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Questable
            </Typography>
            <Typography
              component="h1"
              variant="body1"
              color="inherit"
              noWrap
              sx={{
                marginRight: '20px',
                display: isSignedIn ? 'inline' : 'none'
              }}
            >
              Signed in as {firebase.auth().currentUser?.displayName}
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{
                marginTop: '5px',
                marginBottom: '5px',
                marginRight: '20px',
              }}
              component={Link}
              to={`/settings`}
            >
              Settings
            </Button>
            <Button variant="contained" size="small"
              sx={{
                marginTop: '5px',
                marginBottom: '5px',
                display: isSignedIn ? 'inline' : 'none'
              }}
              onClick={() => firebase.auth().signOut()}
            >
              Log out
            </Button>
          </Toolbar>
        </AppBar>
        {/* Start factoring out here, create a generic layout file and conditionally render classroom sidebar with student or teacher prop */}
        {/* Place sidebar here, potentially need new box for layout */}
        {isSignedIn ?
          /* Navigation routes set by react router. This is placed in
          app.js rather than index.js so we can pass relevant top-level
          props to the elements */
          <Routes>
            <Route path="/" element={<Home user={currentUser} />} />
            {/* <Route path="classrooms" element={<Classrooms user={currentUser} />} /> */}
            <Route path="settings" element={<Settings />} />
            <Route path="class">
              <Route path=":classID" element={<Classroom user={currentUser} />} />
            </Route>
            {/* Catch-all route for any URLs that don't match an existing route */}
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Routes>
          : <SignInScreen></SignInScreen>}
      </Box>
    </ThemeProvider>
  );
}