import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import firebase from 'firebase/compat/app';
import PlayerCard from '../components/playerCard';
import CompletedTasks from './CompletedTasks';
import React from "react";
import TasksTableStudent from './TasksTableStudent';

export default function StudentView({ player, classroom }) {
   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h1">{classroom.name}</Typography>
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h2">Student View</Typography>
            <Typography variant="h5">Display Name: {firebase.auth().currentUser?.displayName}</Typography>
            <PlayerCard player={player} user={user} classroomID={classroom.id}/>
         </Grid>
         <TasksTableStudent player={player} classroom={classroom} />
         <CompletedTasks player={player} classroom={classroom} />
      </Grid>
   )
}