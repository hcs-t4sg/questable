import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FormControlLabel, MenuItem, Select, InputLabel, FormControl, Box, Modal} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { doc, onSnapshot } from "firebase/firestore";
import * as React from 'react';
import { useState } from 'react';
import { db } from '../utils/firebase';
import { addRepeatable, deleteTask, getPlayerData, updateTask } from '../utils/mutations';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getUnixTime } from 'date-fns';

import { addTask } from '../utils/mutations';
import Grid from '@mui/material/Grid';

export default function CreateTaskModal({ classroom, player }) {

   const [open, setOpen] = useState(false);
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [reward, setReward] = React.useState("10");
   const [dueDate, setDueDate] = React.useState(null);

   const[isRepeatable, setIsRepeatable] = useState(false);
   const[maxCompletions, setMaxCompletions] = useState(1);

   const handleOpen = () => {
      setOpen(true);
      setName("");
      setDueDate(new Date());
      setDescription("");
      setReward("10");
      setMaxCompletions(1);
      setIsRepeatable(false);
   };

   const handleClose = () => {
      setOpen(false);
   };

   // Mutation handlers

   const handleAdd = () => {
      if(isRepeatable)
      {
         // check the max completions input
         console.log("maxCompletions: " + maxCompletions);
         if(maxCompletions < 1)
         {
            setMaxCompletions(1);
            alert("Max completions must be greater than 0");
            return;
         }
         // else if(!Number.isInteger(maxCompletions))
         // {
         //    setMaxCompletions(1);
         //    alert("Max completions must be an integer");
         //    return;
         // }

         const newTask = {
            name,
            description,
            reward,
            maxCompletions
         }

         addRepeatable(classroom.id, newTask, player.id).catch(console.error);         

      }
      else
      {
         const newTask = {
            name,
            description,
            reward,
            due: getUnixTime(dueDate),
         };
   
         addTask(classroom.id, newTask, player.id).catch(console.error);
      }

      handleClose();
   };

   // function to handle the date change
   const handleDateChange = (date) => {
      setDueDate(date);
      console.log(date);
   };

   const openButton = <Button sx={{ width: 1 }} onClick={handleOpen} startIcon={<AddCircleOutlineIcon />}>Create Manually</Button>

   const repeatableButton = 
   <DialogActions>
      <Button sx={{ width: 1 }} variant="contained" onClick={()=>{setIsRepeatable(false)}}>One Time</Button>
      <Button sx={{ width: 1 }} variant="contained" onClick={()=>{setIsRepeatable(true)}}>Repeatable</Button>
   </DialogActions>

   const actionButtons =
      <DialogActions>
         <Button variant="contained" onClick={handleAdd}>Add Task</Button>
      </DialogActions>



   return (
      <div>
            {openButton}
            <Modal sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} open={open} onClose={handleClose}>
            <Box sx={{
                    width: '40%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    paddingTop: '40px',
                    backgroundColor: 'white',
                    marginBottom: '18px',
                }}
            >
            <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography fontWeight='light' variant="h5">Overview</Typography>
            <IconButton onClick={handleClose}><CloseIcon /></IconButton>
            </Box>
            
            <hr 
              style={{
                backgroundColor: '#D9D9D9',
                height: '1px',
                borderWidth: '0px',
                borderRadius: '5px',
                width: '100%',
                marginBottom: '10px'
              }}
            />  

            {repeatableButton}
    
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
            <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: 2}}>
            {!isRepeatable ? 
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Due Date"
                value={dueDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
            />
            </LocalizationProvider> :
            <TextField
            margin="normal"
            id="description"
            label="Max Completions"
            fullWidth
            variant="standard"
            placeholder=""
            multiline
            maxRows={8}
            value={maxCompletions}
            onChange={(event) => setMaxCompletions(event.target.value)}
            />
            }  
            </Box>
            <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: 2}}>
                
            <FormControl fullWidth>
            <InputLabel id="reward-dropdown-label">Reward</InputLabel>
            <Select 
                labelId="reward-dropdown"
                id="reward-dropdown"
                value={reward}
                label="Reward"
                onChange={(event) => setReward(event.target.value)}
            >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={40}>40</MenuItem>
            </Select>
            </FormControl>
            </Box>
            <br />
            {/* center the save button */}
            <Grid container justifyContent="center">
                {actionButtons}
            </Grid>
            </Box>
        </Modal>
      </div>
   )
}