import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { collection, onSnapshot } from "firebase/firestore";
import * as React from 'react';
import { db } from '../utils/firebase';
import TaskModalTeacher from './TaskModalTeacher.js';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

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
            setTasks(snapshot.docs.map((task) => (
               { ...task.data() }
            )));
         })
      }
      mapTasks();
   }, []);

   return (
      <Grid item xs={12}>
         <Typography variant="h4">Created Tasks</Typography>
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

                     <TableCell sx={{ "paddingTop": 0, "paddingBottom": 0 }} align="right">
                        <TaskModalTeacher task={task} classroom={classroom} />
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </TableContainer>
      </Grid>
   )
}