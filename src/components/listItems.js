import DashboardIcon from '@mui/icons-material/Dashboard';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupIcon from '@mui/icons-material/Group';
import SellIcon from '@mui/icons-material/Sell';
import SettingsIcon from '@mui/icons-material/Settings';
import FortIcon from '@mui/icons-material/Fort';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmailIcon from '@mui/icons-material/Email';
import * as React from 'react';
import { Link } from "react-router-dom";

// Handles list of pages on sidebar. Edit if you want to add more pages

export const mainListItemsTeacher = (
   <React.Fragment>
      <ListItemButton component={Link} to="tasks">
         <ListItemIcon>
            <AssignmentIcon />
         </ListItemIcon>
         <ListItemText primary="Tasks" />
      </ListItemButton>
      <ListItemButton component={Link} to="requests">
         <ListItemIcon>
            <EmailIcon />
         </ListItemIcon>
         <ListItemText primary="Requests" />
      </ListItemButton>
      <ListItemButton component={Link} to="class-teacher">
         <ListItemIcon>
            <GroupIcon />
         </ListItemIcon>
         <ListItemText primary="Class" />
      </ListItemButton>
      <ListItemButton component={Link} to="class-settings">
         <ListItemIcon>
            <SettingsIcon />
         </ListItemIcon>
         <ListItemText primary="Class Settings" />
      </ListItemButton>
   </React.Fragment>
);

export const mainListItemsStudent = (
   <React.Fragment>
      <ListItemButton component={Link} to="main">
         <ListItemIcon>
            <FortIcon />
         </ListItemIcon>
         <ListItemText primary="Main" />
      </ListItemButton>
      <ListItemButton component={Link} to="shop">
         <ListItemIcon>
            <SellIcon />
         </ListItemIcon>
         <ListItemText primary="Shop" />
      </ListItemButton>
      <ListItemButton component={Link} to="class-student">
         <ListItemIcon>
            <GroupIcon />
         </ListItemIcon>
         <ListItemText primary="Class" />
      </ListItemButton>
   </React.Fragment>
);