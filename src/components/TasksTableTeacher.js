import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import { collection, doc, onSnapshot } from "firebase/firestore";
import * as React from 'react';
import { db } from '../utils/firebase';
import TaskModalTeacher from './TaskModalTeacher.js';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { query, where } from "firebase/firestore";
import { useEffect } from 'react'


export default function TasksTableTeacher({ classroom }) {

   //Create a state variable to hold the tasks
   const [tasks, setTasks] = React.useState([]);

   React.useEffect(() => {
      //Create a reference to the tasks collection
      const taskCollectionRef = collection(db, `classrooms/${classroom.id}/tasks`);

      //Attach a listener to the tasks collection
      onSnapshot(taskCollectionRef, (snapshot) => {
         const tasksFetch = async () => {
            const tasks = [];
            snapshot.forEach(doc => {
               tasks.push(Object.assign({id: doc.id}, doc.data()))
            })
            setTasks(tasks);
         }
         tasksFetch().catch(console.error);
      })
   }, [classroom]);

   return (
      <Grid item xs={12}>
         <Typography variant="h4">Created Tasks</Typography>
         <TableContainer component={Paper}>
         <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
               <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Reward</TableCell>
                  <TableCell>Due</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {tasks?.map((task) => (
                  <TableRow
                     key={task.id}
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                     <TableCell component="th" scope="row" align="center">{task.name}</TableCell>
                     <TableCell align="center">{task.reward}</TableCell>
                     <TableCell alight="center">{task.due}</TableCell>

                     <TableCell sx={{ "paddingTop": 0, "paddingBottom": 0 }} align="center">
                        <TaskModalTeacher task={task} classroom={classroom} />
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         </TableContainer>
      </Grid>
   )
}