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
   const [open, setOpen] = React.useState(true);
   const toggleDrawer = () => {
      setOpen(!open);
   };
   return (
      <Drawer variant="permanent" open={open}>
         <Toolbar
            sx={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'flex-end',
               px: [1],
            }}
         >
            <IconButton onClick={toggleDrawer}>
               <ChevronLeftIcon />
            </IconButton>
         </Toolbar>
         <Divider />
         <List component="nav">
            {mainListItemsTeacher}
         </List>
      </Drawer>
   )
}