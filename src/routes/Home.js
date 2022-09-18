import React from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Home() {
   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h2">Home</Typography>
         </Grid>
      </Grid>
   )
}