import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function StudentView({ player, classroom }) {
   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h2">{classroom.name}</Typography>
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h2">Student View</Typography>
            <Typography variant="h3">{player.name}</Typography>
           </Grid>

           <table>
               <tr>
                   <th>Name</th>
                   <th>Reward</th>
                   <th>Due</th>
               </tr>
           </table>
      </Grid>
   )
}