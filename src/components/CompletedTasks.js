import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from '../utils/firebase';

export default function CompletedTasks({ player, classroom }) {
   const [completedTasks, setCompletedTasks] = useState([])
   const [confirmedTasks, setConfirmedTasks] = useState([])

   useEffect(() => {
      // fetch task information
      const q = query(collection(db, `classrooms/${classroom.id}/tasks`))
      onSnapshot(q, snapshot => {
         const taskFetch = async () => {
            const completed = []
            const confirmed = []
            snapshot.forEach(doc => {
               // Find completed and confirmed tasks using player's id.
               if (doc.data().completed?.includes(player.id)) {
                  completed.push(Object.assign({ id: doc.id }, doc.data()))
               }
               if (doc.data().confirmed?.includes(player.id)) {
                  confirmed.push(Object.assign({ id: doc.id }, doc.data()))
               }
            })
            setCompletedTasks(completed)
            setConfirmedTasks(confirmed)
         }
         taskFetch().catch(console.error)
      })
   }, [classroom.id, player.id])

   return (
      <Grid item xs={12}>
         <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
               <TableHead>
                  <TableRow>
                     <TableCell align="center">Task</TableCell>
                     <TableCell align="center">Description</TableCell>
                     <TableCell align="center">Status</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {completedTasks.map(task => (
                     <TableRow>
                        <TableCell align="center">{task.name}</TableCell>
                        <TableCell align="center">{task.description}</TableCell>
                        <TableCell align="center">Awaiting confirmation</TableCell>
                     </TableRow>
                  ))}
                  {confirmedTasks.map(task => (
                     <TableRow>
                        <TableCell align="center">{task.name}</TableCell>
                        <TableCell align="center">{task.description}</TableCell>
                        <TableCell align="center">Confirmed</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Grid>
   )
}