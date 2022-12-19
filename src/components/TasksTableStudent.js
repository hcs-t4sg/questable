import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import {Table} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { db } from '../utils/firebase';
import TaskModalStudent from './TaskModalStudent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';

export default function TasksTableStudent({tasks, classroom, player}) 
{
   return (
      <Grid item xs={12}>
         <TableContainer component={Paper}>
         <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
               <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Reward</TableCell>
                  <TableCell>Due</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell></TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {tasks.map((task) => (
                  <TableRow
                     key={task.id}
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                     <TableCell component="th" scope="row">{task.name}</TableCell>
                     <TableCell align="right">{task.reward}</TableCell>
                     <TableCell alight="right">{task.due}</TableCell>
                     <TableCell sx={{ "paddingTop": 0, "paddingBottom": 0 }} align="right">
                        <TaskModalStudent task={task} classroom={classroom} player={player} />
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         </TableContainer>
      </Grid>
   )
}