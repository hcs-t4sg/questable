import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CompletedTasks from './CompletedTasks';
import { Link, Route, Routes, Outlet } from "react-router-dom";
import React from "react";

import TasksTableStudent from './TasksTableStudent';
import Layout from './Layout.js';

import ClassStudent from '../routes/student/ClassStudent';
import Main from '../routes/student/Main';
import Shop from '../routes/student/Shop';

export default function StudentView({ player, classroom }) {

   return (
      <Outlet />
   )
}

{/* <Grid container spacing={3}>
            <Grid item xs={12}>
               <Typography variant="h1">{classroom.name}</Typography>
            </Grid>
            <Grid item xs={12}>
               <Typography variant="h2">Student View</Typography>
               <Typography variant="h3">{player.name}</Typography>
            </Grid>
            <TasksTableStudent player={player} classroom={classroom} />
            <CompletedTasks player={player} classroom={classroom} />
         </Grid> */}