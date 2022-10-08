import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { addTask} from '../utils/mutations';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query} from "firebase/firestore";
import { db } from '../utils/firebase';
import { denyTask, confirmTask } from '../utils/mutations'

export default function TeacherView({ player, classroom, user }) {
   const [completedTasks, setCompletedTasks] = useState(null)
   const [playerData, setPlayerData] = useState(null)
   const [open, setOpen] = useState(false);
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [reward, setReward] = React.useState(0);
   const [due, setDue] = React.useState(Date.now);

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
         const cTaskFetch =  async () => {
            const queryRes = []
            snapshot.forEach(doc => {
               queryRes.push(Object.assign({ id: doc.id }, doc.data()))
            })
            setCompletedTasks(queryRes)
         }
         cTaskFetch().catch(console.error)
      })

   }, [classroom.id])

   const handleClickOpen = () => {
      setOpen(true);
      setName("");
      setDescription("");
      setReward(0);
      setDue(Date.now);
   };

   const handleClose = () => {
      setOpen(false);
   };

   // Mutation handlers

   const handleAdd = () => {
      const newTask = {
         name: name,
         description: description,
         reward: reward,
         due: due,
      };
      
      addTask(classroom.id, newTask, user).catch(console.error);
      handleClose();
   };

   const openButton =
      <Button variant="contained" onClick={handleClickOpen}>
         Add Task
      </Button>

   const actionButtons =
      <DialogActions>
         <Button onClick={handleClose}>Cancel</Button>
         <Button variant="contained" onClick={handleAdd}>Add Task</Button>
      </DialogActions>

   return (
   <>
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h2">{classroom.name}</Typography>
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h2">Teacher View</Typography>
            <Typography variant="h3">{player.name}</Typography>
         </Grid>
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
               <TableRow>
                  <TableCell align="center">Student</TableCell>
                  <TableCell align="center">Task</TableCell>
                  <TableCell align="center">Confirmation</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
                  {/* For each task, map over player IDs in completed array, then map over players with IDs in that array. */}
                  {completedTasks.map(task => {
                     return (task.completed.map(playerID => {
                        const playersCompleted = playerData.filter(player => player.id === playerID)
                        return (playersCompleted.map(player => (
                           <TableRow key={'test'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell align="center" component="th" scope="row"> {player.name}</TableCell>
                              <TableCell align="center">{task.name}</TableCell>
                              <TableCell align="center">
                                 <Button onClick={() => confirmTask(classroom.id, player.id, task.id)} variant="contained">Confirm</Button>
                                 <Button onClick={() => denyTask(classroom.id, player.id, task.id)} variant="contained" color="error">Deny</Button>
                              </TableCell>
                           </TableRow>
                        )))
                     })
                  )})}
            </TableBody>
         </Table>
      </TableContainer>
      </Grid>
      <div>
         {openButton}
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Add Task"}</DialogTitle>
            <DialogContent>
               {/* TODO: Feel free to change the properties of these components to implement editing functionality. The InputProps props class for these MUI components allows you to change their traditional CSS properties. */}
               <TextField
                  margin="normal"
                  id="name"
                  label="Name"
                  fullWidth
                  variant="standard"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="description"
                  label="Description"
                  fullWidth
                  variant="standard"
                  multiline
                  maxRows={8}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="reward"
                  label="Reward"
                  fullWidth
                  variant="standard"
                  multiline
                  maxRows={8}
                  value={reward}
                  onChange={(event) => setReward(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="due"
                  label="Due"
                  fullWidth
                  variant="standard"
                  multiline
                  maxRows={8}
                  value={due}
                  onChange={(event) => setDue(event.target.value)}
               />
            </DialogContent>
            {actionButtons}
         </Dialog>
      </div>
    </>
   )
}