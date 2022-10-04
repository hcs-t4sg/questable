import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { collection, onSnapshot } from "firebase/firestore";
import React from "react";
import { db } from '../utils/firebase';

import TaskModalTeacher from './TaskModalTeacher.js';

export default function TeacherView({ player, classroom }) {
    //Create a reference to the tasks collection
    const taskCollectionRef = collection(db, 'classrooms/'+classroom.id+'/tasks');
    //Create a state variable to hold the tasks
    const [tasks, setTasks] = React.useState([]);
    React.useEffect(() => {
        const mapTasks = async () => {
            //Attach a listener to the tasks collection
            onSnapshot(taskCollectionRef, (snapshot) => {
                //Append the task id as an element and then store the array in the tasks variable
                setTasks(snapshot.docs.map((task) => (
                        {...task.data()}
                )));
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
            <Typography variant="h2">Teacher View</Typography>
            <Typography variant="h3">{player.name}</Typography>
           </Grid>
            {/* Create the table to hold the tasks info and map the tasks to it */}
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
                            <TaskModalTeacher task={task} classroom={classroom} />
                        </TableCell>
                    </TableRow>
                   ))}
               </TableBody>
           </TableContainer>
       </Grid>
      
   )
}