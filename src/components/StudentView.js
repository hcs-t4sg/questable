import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { db } from '../utils/firebase';

import { getTaskData } from '../utils/mutations';
import TaskModalStudent from './TaskModalStudent';


export default function StudentView({ player, classroom }) {
    //Create a state variable to hold the tasks assigned to the player
    const [tasks, setTasks] = React.useState([]);
    //Create a reference to the tasks collection
    const tasksRef = collection(db, `classrooms/${classroom.id}/tasks`);
    //Create a query to filter for only the tasks that are assigned to the student
    const q = query(tasksRef, where("assigned", "array-contains", player.id));

    React.useEffect(() => {
        // Attach a listener to the tasks collection
        onSnapshot(q, (snapshot) => {
            const mapTasks = async () => {
                // Map the task id's to the task data using `getTaskData`
                const tasks = await snapshot.docs.map(async (doc)=>(
                    await getTaskData(classroom.id, doc.data().id)
                )); 
                // Await the resolution of all promises in the returned array
                // and then store them in the `tasks` state variable
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
                setTasks(await Promise.all(tasks));
            }   
            // Call the async `mapTasks` function
            mapTasks().catch(console.error);
        })
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