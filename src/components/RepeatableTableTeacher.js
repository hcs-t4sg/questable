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
import RepeatableModalTeacher from './RepeatableModalTeacher.js';
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


export default function RepeatableTableTeacher({ classroom }) {
   //Create a state variable to hold the tasks
   const [repeatables, setRepeatables] = React.useState([]);
   React.useEffect(() => {
      const mapRepeatables = async () => {
         //Create a reference to the tasks collection
         const repeatableCollectionRef = collection(db, `classrooms/${classroom.id}/repeatables`);
         //Attach a listener to the tasks collection
         onSnapshot(repeatableCollectionRef, (snapshot) => {
            //Store the tasks in the `tasks` state variable
            setRepeatables(snapshot.docs.map((doc) => (
               { ...doc.data(), id: doc.id }
            )));
         })
      }
      mapRepeatables();
   }, []);


   const handleDelete = (task) => {
      // message box to confirm deletion
      if (window.confirm("Are you sure you want to delete this repeatable task?")) {
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
                     <TableCell>Max Completions</TableCell>
                     <TableCell>Reward </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {repeatables?.map((repeatable) => (
                     <TableRow
                        key={repeatable.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                     >

                        <TableCell sx={{ "paddingTop": 0, "paddingBottom": 0, width: .01 }} align="left">
                           <RepeatableModalTeacher task={repeatable} classroom={classroom} />
                        </TableCell>

                        <TableCell component="th" scope="row">{repeatable.name}</TableCell>
                        <TableCell align="left">{truncate(repeatable.description)}</TableCell>
                        <TableCell align="left">{repeatable.maxCompletions}</TableCell>
                        <TableCell alight="left">{repeatable.reward}</TableCell>

                        <TableCell align="right" sx={{width:.01}}>
                           <IconButton onClick={() => handleDelete(repeatable)}><MoreVertIcon /></IconButton>
                        </TableCell>

                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Grid>
   )
}