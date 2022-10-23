import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState } from 'react';
import { db } from '../utils/firebase';
import { deleteTask, getPlayerData, updateTask } from '../utils/mutations';
import { collection, doc, onSnapshot } from "firebase/firestore";


export default function TaskModalTeacher({ task, classroom }) {
    //State variables
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
    // Handle the click of an edit button
    const handleEdit = () => {
        const updatedTask = {
            name: name,
            due: due,
            reward: reward,
            id: task.id,
        }
        // Call the `updateTask` mutation
        updateTask(classroom.id, updatedTask);
        handleClose();
    };

    // Call the `deleteTask` mutation
    const handleDelete = () => {
        deleteTask(classroom.id, task.id);
    };

    const openButton = <IconButton onClick={handleClickOpen}>
        <OpenInNewIcon />
    </IconButton>;

    const editButton = <Button onClick={handleEdit}>Edit</Button>;
    const deleteButton = <Button onClick={handleDelete}>Delete</Button>;

    const [completed, setCompleted] = React.useState([]);

    React.useEffect(() => {
        // Create a reference to the tasks collection & filter for tasks that are assigned to the student.
        const taskRef = doc(db, `classrooms/${classroom.id}/tasks/${task.id}`);

        // Attach a listener to the tasks collection
        onSnapshot(taskRef, (snapshot) => {
            const playersFetch = async () => {
                const completedPlayers = [];
                snapshot.data()?.completed.forEach(async (completedID) => {
                    completedPlayers.push(Object.assign({ id: completedID }, (await getPlayerData(classroom.id, completedID))))
                })
                setCompleted(completedPlayers)
            }
            playersFetch().catch(console.error)
        })
    }, [classroom])

    return (
        <div>
            {openButton}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{name}</DialogTitle>
                <DialogContent>
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
                            {completed.map((player) => (
                                <TableRow
                                    key={player.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{player.name}</TableCell>
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