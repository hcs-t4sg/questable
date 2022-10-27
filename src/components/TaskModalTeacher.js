import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
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



export default function TaskModalTeacher({ task, classroom }) {
    //State variables
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(task.name);
    const [reward, setReward] = useState(task.reward);
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState(task.description);

    // Open the task modal
    const handleClickOpen = () => {
        setOpen(true);
        setName(task.name);
        setDate(task.due);
        setReward(task.reward);
    };
    // Close the task modal
    const handleClose = () => {
        setOpen(false);
    };
    // Handle the click of an edit button
    const handleEdit = () => {
        const updatedTask = {
            name: name,
            due: date,
            reward: reward,
            id: task.id,
        }
        // Call the `updateTask` mutation
        updateTask(classroom.id, updatedTask);
        handleClose();
    };

    // Call the `deleteTask` mutation
    const handleDelete = () => {
        console.log(task)
        deleteTask(classroom.id, task.id);
    };

    const openButton = <IconButton onClick={handleClickOpen}>
        <OpenInNewIcon />
    </IconButton>;

    const editButton = <Button onClick={handleEdit}>Edit</Button>;
    const deleteButton = <Button onClick={handleDelete}>Delete</Button>;

    const [completed, setCompleted] = React.useState([]);

    React.useEffect(() => {

        const taskRef = doc(db, `classrooms/${classroom.id}/tasks/${task.id}`);

        // Attach a listener to the tasks collection
        onSnapshot(taskRef, (snapshot) => {
            const mapCompleted = async () => {
                //Map all the player ID's to their names using `getPlayerData(...)`
                const names = await snapshot.data()?.completed.map(async (player) => (
                    { id: player, name: (await getPlayerData(classroom.id, player)).name }
                ));

                if (names) {
                    setCompleted(await Promise.all(names));
                }
            }
            //Run this async function   
            mapCompleted().catch(console.error);
        })
    });

    return (
        <div>
            {openButton}
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <Typography variant="h5">Overview</Typography>
                    <Typography variant="h5">Edit Task</Typography>
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
                    <RadioGroup row onChange={(event) => {setReward(event.target.value)}}>    
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
                    {editButton}
                    {deleteButton}
                </DialogContent>
            </Dialog>
        </div>
    );
}