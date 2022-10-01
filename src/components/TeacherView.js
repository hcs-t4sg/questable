import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import firebase from 'firebase/compat/app';
import PlayerCard from '../components/playerCard';
import { useState } from 'react';
import { doc } from 'firebase/firestore';


export default function StudentView({ user, player, classroom }) {
   // const [name, setName] = useState(player.name);

   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h2">{classroom.name}</Typography>
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h2">Teacher View</Typography>
            <Typography variant="h5">Display Name: {firebase.auth().currentUser?.displayName}</Typography>
            <PlayerCard player={player} user={user} classroomID={classroom.id}/>
         </Grid>
      </Grid>
   )
}