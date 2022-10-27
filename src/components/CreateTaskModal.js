import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { doc, onSnapshot } from "firebase/firestore";
import * as React from 'react';
import { useState } from 'react';
import { db } from '../utils/firebase';
import { deleteTask, getPlayerData, updateTask } from '../utils/mutations';

import { DatePicker } from '@material-ui/pickers'

import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { addTask } from '../utils/mutations';
import Grid from '@mui/material/Grid';

export default function CreateTaskModal({ classroom, player }) {

   const [open, setOpen] = useState(false);
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [reward, setReward] = React.useState("10");
   const [date, setDate] = React.useState(Date.now);

   const handleOpen = () => {
      setOpen(true);
      setName("");
      setDate(Date.now);
      setDescription("");
      setReward("10");
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
         date,
      };

      addTask(classroom.id, newTask, player.id).catch(console.error);
      handleClose();
   };

   const openButton = <Button sx={{width:1}}  onClick={handleOpen}>Create Manually</Button>

   const actionButtons =
      <DialogActions>
         <Button onClick={handleClose}>Cancel</Button>
         <Button variant="contained" onClick={handleAdd}>Add Task</Button>
      </DialogActions>

   return (
      <Grid item xs={12}>
         {openButton}
         <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <Typography variant="h5">Create New Task</Typography>
                    <TextField
                        margin="normal"
                        id="name"
                        label="Task Name"
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
                        placeholder=""
                        multiline
                        maxRows={8}
                        value={description} 
                        onChange={(event) => setDescription(event.target.value)}
                    />
                    <RadioGroup row onChange={(event) => {setReward(event.target.value)}} defaultValue="10">    
                        <FormControlLabel label="10" value="10" control={<Radio />} />
                        <FormControlLabel label="20" value="20" control={<Radio />} />
                        <FormControlLabel label="30" value="30" control={<Radio />} />
                        <FormControlLabel label="40" value="40" control={<Radio />} />
                        <FormControlLabel label="50" value="50" control={<Radio />} />
                    </RadioGroup>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            label="DatePicker"
                            inputVariant="outlined"
                            value={date}
                            onChange={(event) => {setDate(event.target.value)}}
                        />
                    </MuiPickersUtilsProvider>
                    <br />
                    {actionButtons}
                </DialogContent>
            </Dialog>
      </Grid>
   )
}