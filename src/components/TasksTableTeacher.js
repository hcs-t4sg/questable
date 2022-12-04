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
import { format, fromUnixTime } from 'date-fns';
import {deleteTask} from '../utils/mutations'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

function truncate(description) {
   if (description.length > 50) {
      return description.slice(0, 50) + "..."
   }
   return description;
}

function percentDone(task) {
   const numCompleted = task.completed?.length;
   const numAssigned = task.assigned?.length;
   const numConfirmed = task.confirmed?.length;
   return ((numConfirmed) / (numCompleted + numConfirmed + numAssigned)) * 100;
}

function LinearProgressWithLabel({task}) {
   console.log(task);
   return (
     <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ minWidth: 100 }}>
         <Typography variant="body2" color="text.secondary">{`${task.confirmed?.length}/${task.completed?.length + task.assigned?.length + task.confirmed?.length} students`}</Typography>
       </Box>
       <Box sx={{ minWidth: '50%', mr: 1 }} align="right">
         <LinearProgress variant="determinate" value={percentDone(task)} />
       </Box>
     </Box>
   );
 };


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
               { ...doc.data(), id: doc.id }
            )));
         })
      }
      mapTasks();
      console.log(tasks);
   }, []);


   const handleDelete = (task) => {
      // message box to confirm deletion
      if (window.confirm("Are you sure you want to delete this task?")) {
         deleteTask(classroom.id, task.id).catch(console.error);
      }
   }

   return (
      <Grid item xs={12}>
         <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
               <TableHead>
                  <TableRow>
                     <TableCell sx={{m:'1%', p:'1%'}}></TableCell>
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
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                     >

                        <TableCell sx={{ "paddingTop": 0, "paddingBottom": 0, width: .01 }} align="left">
                              <TaskModalTeacher task={task} classroom={classroom}/>
                        </TableCell>

                        <TableCell component="th" scope="row">{task.name}</TableCell>
                        <TableCell align="left">{truncate(task.description)}</TableCell>
                        <TableCell align="left">{format(fromUnixTime(task.due), 'MM/dd/yyyy')}</TableCell>
                        <TableCell alight="left">{task.reward}</TableCell>
                        <TableCell align="left"><LinearProgressWithLabel variant="determinate" task={task} /></TableCell>

                        <TableCell align="right" sx={{width:.01}}>
                           <IconButton onClick={() => handleDelete(task)}><MoreVertIcon /></IconButton>
                        </TableCell>

                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Grid>
   )
}