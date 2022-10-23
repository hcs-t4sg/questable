import React from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Layout from '../components/Layout.js';

export default function Settings() {
   return (
      <Layout>
         <Grid container spacing={3}>
            <Grid item xs={12}>
               <Typography variant="h2">Settings</Typography>
            </Grid>
         </Grid>
      </Layout>
   )
}