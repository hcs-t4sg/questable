import React from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Settings() {
   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h2">Settings</Typography>
         </Grid>
      </Grid>
   )
}