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
import { LinearProgress } from '@mui/material';

function truncate(description){
   if(description.length > 50){
      return description.slice(0, 50) + "..."
   }
   return description;
}

function percentDone(task){
   const numCompleted = task.completed?.length;
   const numAssigned = task.assigned?.length;
   const numConfirmed = task.confirmed?.length;
   return ((numConfirmed)/(numCompleted+numConfirmed+numAssigned))*100;
}

export default function TasksTableTeacher({ classroom }) {

   //Create a state variable to hold the tasks
   const [tasks, setTasks] = React.useState([]);
   React.useEffect(() => {
      const mapTasks = async () => {
         //Create a reference to the tasks collection
         const taskCollectionRef = collection(db, `classrooms/${classroom.id}/tasks`);
         //Attach a listener to the tasks collection
         onSnapshot(taskCollectionRef, (snapshot) => {
            //Store the tasks in the `tasks` state variable
            setTasks(snapshot.docs.map((doc) => (
               { ...doc.data(), id:doc.id }
            )));
         })
      }
      mapTasks();
   }, []);
   return (
      <Grid item xs={12}>
         <TableContainer component={Paper}>
         <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
               <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Reward </TableCell>
                  <TableCell>Students Confirmed</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {tasks?.map((task) => (
                  <TableRow
                     key={task.id}
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                     
                     <TableCell sx={{ "paddingTop": 0, "paddingBottom": 0 }} align="left">
                        <TaskModalTeacher task={task} classroom={classroom} />
                     </TableCell>

                     <TableCell component="th" scope="row">{task.name}</TableCell>
                     <TableCell align="left">{truncate(task.description)}</TableCell>
                     <TableCell align="left">{new Date(task.due).toLocaleDateString("en-US")}</TableCell>
                     <TableCell alight="left">{task.reward}</TableCell>
                     <TableCell align="left"><LinearProgress variant="determinate" value={percentDone(task)}/></TableCell>
                  </TableRow>
               ))}
            </TableBody>
            </Table>
         </TableContainer>
      </Grid>
   )
}