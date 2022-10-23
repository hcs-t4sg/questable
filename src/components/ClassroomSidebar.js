import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React from "react";
import '../App.css';
import { mainListItemsTeacher } from './listItems';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
   ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
         position: 'relative',
         whiteSpace: 'nowrap',
         width: drawerWidth,
         transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
         }),
         boxSizing: 'border-box',
         ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
               easing: theme.transitions.easing.sharp,
               duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
               width: theme.spacing(9),
            },
         }),
      },
   }),
);

export default function ClassroomSidebar() {
   // Navbar drawer functionality
   const [open, setOpen] = React.useState(false);

   return (
      <Drawer variant="permanent" open={open} onMouseOver={() => setOpen(true)} onMouseOut={() => setOpen(false)}>
         <Toolbar
            sx={{
               px: [1],
            }}
         >
         </Toolbar>
         <Divider />
         {/* <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer} sx={{
              // pt: 2,
              // pb: 2,
            }}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Toolbar> */}
         <Divider />
         <List component="nav">
            {mainListItemsTeacher}
         </List>
      </Drawer>
   )
}