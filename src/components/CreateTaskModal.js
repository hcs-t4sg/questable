import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState } from 'react';
import { addTask } from '../utils/mutations';
import Grid from '@mui/material/Grid';

export default function CreateTaskModal({ classroom, user }) {

   const [open, setOpen] = useState(false);
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [reward, setReward] = React.useState(0);
   const [due, setDue] = React.useState(Date.now);

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
         name,
         description,
         reward,
         due,
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
      <Grid item xs={12}>
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
      </Grid>
   )
}