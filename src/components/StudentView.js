import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { setDoc, updateDoc, query,  where, onSnapshot, doc, getDocs, addDoc, deleteDoc,  collection, getDoc } from "firebase/firestore";
import { db } from '../utils/firebase';
import React from "react";

import TaskModalStudent from './TaskModalStudent'
import { getTaskData } from '../utils/mutations';


export default function StudentView({ player, classroom }) {
    //Create a state variable to hold the tasks assigned to the player
    const [tasks, setTasks] = React.useState([]);
    //Create a reference to the tasks collection
    const assignedTasksCollectionRef = collection(db, 'classrooms/'+classroom.id+'/assignedTasks');
    //Create a query to filter for only the tasks that are assigned to the student
    const q = query(assignedTasksCollectionRef, where("player", "==", player.id));

    async function getTask(assignedTask)
    {
        const task = await getTaskData(classroom.id, assignedTask.data().assignedTask);
        return task;
    }

    React.useEffect(() => {
        const mapTasks = async () => {
            //Attach a listener to the tasks collection
            onSnapshot(q, (snapshot) => {
                setTasks(snapshot.docs.map(getTask));
            })
        }
        mapTasks();
    }, []);
    
   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h2">{classroom.name}</Typography>
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h2">Student View</Typography>
            <Typography variant="h3">{player.name}</Typography>
           </Grid>
           {/* Create the table to hold the student's assigned tasks info and map the tasks to it */}
           <TableContainer>
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
                        <TableCell component="th" scope="row">{task.name}</TableCell>
                        <TableCell align="right">{task.reward}</TableCell>
                        <TableCell alight="right">{task.due}</TableCell>

                        <TableCell sx={{ "padding-top": 0, "padding-bottom": 0 }} align="right">
                            <TaskModalStudent task={task} classroom={classroom} player={player} />
                        </TableCell>
                    </TableRow>
                   ))}
               </TableBody>
           </TableContainer>
      </Grid>
   )
}