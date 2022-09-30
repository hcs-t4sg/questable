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

export default function TeacherView({ player, classroom }) {
    const taskCollectionRef = collection(db, 'classrooms/'+classroom.id+'/tasks');


    const [tasks, setTasks] = React.useState([]);

    onSnapshot(taskCollectionRef, (snapshot) => {
       setTasks(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    })
    
    
    return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h2">{classroom.name}</Typography>
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h2">Teacher View</Typography>
            <Typography variant="h3">{player.name}</Typography>
           </Grid>
            
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
                    </TableRow>
                   ))}
               </TableBody>
           </TableContainer>
       </Grid>
      
   )
}