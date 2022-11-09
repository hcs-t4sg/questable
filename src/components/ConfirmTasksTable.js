import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
import { denyTask, confirmTask } from '../utils/mutations'

function truncate(description){
   if(description.length > 40){
      return description.slice(0, 40) + "..."
   }
   return description;
}

export default function ConfirmTasksTable({ classroom }) {
   const [completedTasks, setCompletedTasks] = useState([])
   const [playerData, setPlayerData] = useState(null)

   useEffect(() => {
      // fetch player information
      const q = query(collection(db, `classrooms/${classroom.id}/players`))
      onSnapshot(q, snapshot => {
         const playerDataFetch = async () => {
            const queryRes = []
            snapshot.forEach(doc => {
               // attach player ID to doc data for each player and push into array.
               queryRes.push(Object.assign({ id: doc.id }, doc.data()))
            })
            setPlayerData(queryRes)
         }
         playerDataFetch().catch(console.error);
      })

      // fetch task information
      const qt = query(collection(db, `classrooms/${classroom.id}/tasks`))
      onSnapshot(qt, snapshot => {
         const cTaskFetch = async () => {
            const queryRes = []
            snapshot.forEach(doc => {
               queryRes.push(Object.assign({ id: doc.id }, doc.data()))
            })
            setCompletedTasks(queryRes)
         }
         cTaskFetch().catch(console.error)
      })

   }, [classroom.id])

   return (
      <Grid item xs={12}>
         <Typography variant="h4">Tasks Awaiting Confirmation</Typography>
         <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
               <TableHead>
                  <TableRow>
                     <TableCell align="center">Task</TableCell>
                     <TableCell align="center">Description</TableCell>
                     <TableCell align="center">Deadline</TableCell>
                     <TableCell align="center">Reward</TableCell>
                     <TableCell align="center">Student</TableCell>
                     <TableCell align="center">Confirm?</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {/* For each task, map over player IDs in completed array, then map over players with IDs in that array. */}
                  {completedTasks.map(task => {
                     return (task.completed?.map(playerID => {
                        const playersCompleted = playerData.filter(player => player.id === playerID)
                        return (playersCompleted.map(player => (
                           <TableRow key={'test'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell align="center">{task.name}</TableCell>
                              <TableCell align="center">{truncate(task.description)}</TableCell>
                              <TableCell align="center">{task.deadline}</TableCell>
                              <TableCell align="center">{task.reward}</TableCell>
                              <TableCell align="center" component="th" scope="row">{player.name}</TableCell>
                              <TableCell align="center">
                                 <Button onClick={() => confirmTask(classroom.id, player.id, task.id)} variant="contained">Confirm</Button>
                                 <Button onClick={() => denyTask(classroom.id, player.id, task.id)} variant="contained" color="error">Deny</Button>
                              </TableCell>
                           </TableRow>
                        )))
                     })
                     )
                  })}
               </TableBody>
            </Table>
         </TableContainer>
      </Grid>
   )
}