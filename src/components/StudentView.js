import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function StudentView({ player, classroom }) {
   return (
      <Grid item xs={12}>
         <Typography variant="h2">Student View</Typography>
         <Typography variant="h3">{player.name}</Typography>
      </Grid>
   )
}