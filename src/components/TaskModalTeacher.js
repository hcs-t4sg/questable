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
import { db } from '../utils/firebase';
import Typography from '@mui/material/Typography';
import { setDoc, updateDoc, query,  where, onSnapshot, doc, getDocs, addDoc, deleteDoc,  collection, getDoc } from "firebase/firestore";
// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened.
   This can be "add" (for adding a new entry) or
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user). */

export default function TaskModalTeacher({ task, classroom}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(task.name);
    const [reward, setReward] = useState(task.reward);
    const [due, setDue] = useState(task.due);
    const [description, setDescription] = useState(task.description);

    //Array that holds all players to have completed this task

    const handleClickOpen = () => {
        setOpen(true);
        setName(task.name);
        setDue(task.due);
        setReward(task.reward);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = () => {
        const updatedTask = {
            name: name,
            due: due,
            reward: reward,
            id: task.id,
        }
        updateTask(classroom.id, updatedTask);
        handleClose();
    };

    const handleDelete = () => {
        deleteTask(classroom.id, task.id);
    };

    const openButton =  <IconButton onClick={handleClickOpen}>
                            <OpenInNewIcon />
                        </IconButton>;

    const editButton = <Button onClick={handleEdit}>Edit</Button>;
    const deleteButton = <Button onClick={handleDelete}>Delete</Button>;

    const completedTaskRef = collection(db, `classrooms/${classroom.id}/completedTasks`);
    const q = query(completedTaskRef, where("completedTask", "==", task.id));

    async function getName(player)
    {
        const name = await getPlayerData(classroom.id, player.data().player);
        return name.name;
    }

    const [completed, setCompleted] = React.useState([]);
    React.useEffect(() => {
        const mapCompleted = async () => {
            //Attach a listener to the tasks collection
            onSnapshot(q, (snapshot) => {
                //Append the task id as an element and then store the array in the tasks variable
                setCompleted(snapshot.docs.map((player)=>player.data().player)); //TODO: get the player name, not the id
            })
        }
        mapCompleted();
        console.log(completed);
    }, []);


return (
    <div>
       {openButton}
       <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{name}</DialogTitle>
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
                id="reward"
                label="Reward"
                placeholder="0"
                fullWidth
                variant="standard"
                value={reward}
                onChange={(event) => setReward(event.target.value)}
             />
             <TextField
                margin="normal"
                id="date"
                label="Date"
                fullWidth
                variant="standard"
                placeholder=""
                multiline
                maxRows={1}
                value={due}
                onChange={(event) => setDue(event.target.value)}
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
            {/* Table to hold all students to have completed the task */}
            <TableContainer>
               <TableHead>
                   <TableRow>
                       <TableCell>Stuents that Have Completed this Task</TableCell>
                   </TableRow>
               </TableHead>
               <TableBody>
                {completed.map((playerName) => ( 
                    <TableRow
                    key={playerName}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">{playerName}</TableCell>
                    </TableRow>
                ))}
               </TableBody>
           </TableContainer>

          {editButton}
          {deleteButton}
          </DialogContent>
       </Dialog>
    </div>
 );
}