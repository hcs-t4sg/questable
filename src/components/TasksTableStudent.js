import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { db } from '../utils/firebase';
import TaskModalStudent from './TaskModalStudent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react'


export default function TasksTableStudent({ player, classroom }) {
   //Create a state variable to hold the tasks assigned to the student.
   const [tasks, setTasks] = useState([]);
   useEffect(() => {
      // Create a reference to the tasks collection & filter for tasks that are assigned to the student.
      const tasksRef = collection(db, `classrooms/${classroom.id}/tasks`);
      const q = query(tasksRef, where("assigned", "array-contains", player.id));

      // Attach a listener to the tasks collection
      onSnapshot(q, (snapshot) => {
         const taskFetch = async () => {
            const assigned = []
            snapshot.forEach(doc => {
               assigned.push(Object.assign({ id: doc.id }, doc.data()))
            })
            setTasks(assigned)
         }
         taskFetch().catch(console.error)
      })
   }, [classroom, player])

   return (
      <Grid item xs={12}>
         <Typography variant="h4">Assigned Tasks</Typography>
         <TableContainer>
            <TableHead>
               <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Reward</TableCell>
                  <TableCell>Due</TableCell>
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
         </TableContainer>
      </Grid>
   )
}