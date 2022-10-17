import DashboardIcon from '@mui/icons-material/Dashboard';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';

// Handles list of pages on sidebar. Edit if you want to add more pages

export const mainListItems = (
   <React.Fragment>
      <ListItemButton>
         <ListItemIcon>
            <DashboardIcon />
         </ListItemIcon>
         <ListItemText primary="Tasks" />
      </ListItemButton>
      <ListItemButton>
         <ListItemIcon>
            <DashboardIcon />
         </ListItemIcon>
         <ListItemText primary="Requests" />
      </ListItemButton>
      <ListItemButton>
         <ListItemIcon>
            <DashboardIcon />
         </ListItemIcon>
         <ListItemText primary="Class" />
      </ListItemButton>
      <ListItemButton>
         <ListItemIcon>
            <DashboardIcon />
         </ListItemIcon>
         <ListItemText primary="Class Settings" />
      </ListItemButton>
   </React.Fragment>
);