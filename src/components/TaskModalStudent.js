import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState } from 'react';
import { updateTask, deleteTask, getPlayerData} from '../utils/mutations';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { completeTask } from '../utils/mutations';
import Typography from '@mui/material/Typography';
// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened.
   This can be "add" (for adding a new entry) or
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user). */

export default function TaskModalStudent({ task, classroom, player }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(task.name);
    const [reward, setReward] = useState(task.reward);
    const [due, setDue] = useState(task.due);
    const [description, setDescription] = useState(task.description);

    const handleClickOpen = () => {
        setOpen(true);
        setName(task.name);
        setDue(task.due);
        setReward(task.reward);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleComplete = () => {
        completeTask(classroom.id, task.id, player.id);
        handleClose();
    };

    const openButton =  <IconButton onClick={handleClickOpen}>
                            <OpenInNewIcon />
                        </IconButton>;

    const completeButton = <Button onClick={handleComplete}>Mark as Complete</Button>;

return (
    <div>
       {openButton}
       <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{name}</DialogTitle>
          <DialogContent>
             <Typography variant="h4">Name</Typography>
             <Typography variant="h4">{name}</Typography>

             <Typography variant="h4">Due</Typography>
             <Typography variant="h4">{due}</Typography>

             <Typography variant="h4">Reward</Typography>
             <Typography variant="h4">{reward}</Typography>
            
             <Typography variant="h4">Description</Typography>
             <Typography variant="h4">{description}</Typography>

          {completeButton}
          
          </DialogContent>
       </Dialog>
    </div>
 );
}