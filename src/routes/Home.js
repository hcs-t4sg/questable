import React from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Home() {
   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Box
               sx={{
               width: 600,
               height: 300,
               backgroundColor: 'primary.dark',
               }}
            >
               <Typography variant="h3">Wecome Back!</Typography>
               <Button>Join!</Button>
               <Button>Create!</Button>
            </Box>
         </Grid>
      </Grid>
   )
}