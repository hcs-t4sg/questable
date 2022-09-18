import DashboardIcon from '@mui/icons-material/Dashboard';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { Link } from "react-router-dom";

// Handles list of pages on sidebar. Edit if you want to add more pages

export const mainListItems = (
   <React.Fragment>
      <ListItemButton component={Link} to="/classrooms">
         <ListItemIcon>
            <DashboardIcon />
         </ListItemIcon>
         <ListItemText primary="Select Classroom" />
      </ListItemButton>
      <ListItemButton component={Link} to="/settings">
         <ListItemIcon>
            <DashboardIcon />
         </ListItemIcon>
         <ListItemText primary="Settings" />
      </ListItemButton>
   </React.Fragment>
);