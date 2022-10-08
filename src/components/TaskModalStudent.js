import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import { completeTask } from '../utils/mutations';

export default function TaskModalStudent({ task, classroom, player }) {
    // State variables
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(task.name);
    const [reward, setReward] = useState(task.reward);
    const [due, setDue] = useState(task.due);
    const [description, setDescription] = useState(task.description);

    // Open the task modal
    const handleClickOpen = () => {
        setOpen(true);
        setName(task.name);
        setDue(task.due);
        setReward(task.reward);
    };
    // Close the task modal
    const handleClose = () => {
        setOpen(false);
    };
    // Handle task completion
    const handleComplete = () => {
        // Call the `completeTask` mutation
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