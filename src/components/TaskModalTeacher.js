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
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

// import { DatePicker } from '@material-ui/pickers'

// import DateFnsUtils from '@date-io/date-fns';
// import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";


// import {
//     Chart,
//     PieSeries,
//     Title
// } from '@devexpress/dx-react-chart-material-ui';


export default function TaskModalTeacher({ task, classroom }) {
    //State variables
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(task.name);
    const [reward, setReward] = useState(task.reward);
    const [date, setDate] = useState(null);
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
            due: date.unix(),
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
    const cancelButton = <Button onClick={handleClose}>Cancel</Button>;

    const [completed, setCompleted] = React.useState([]);

    const [chartData, setChartData] = React.useState([]);

    React.useEffect(() => {

        const taskRef = doc(db, `classrooms/${classroom.id}/tasks/${task.id}`);

        // Attach a listener to the tasks collection
        onSnapshot(taskRef, (snapshot) => {

            const numCompleted = snapshot.data()?.completed.length;
            const numAssigned = snapshot.data()?.assigned.length;
            const numConfirmed = snapshot.data()?.confirmed.length;

            setChartData([
                { argument: 'Finished', value: numCompleted + numConfirmed }, // TODO: is this how we want this to be?
                { argument: 'Not yet started', value: numAssigned },
            ]);

        })
    });


    // function to handle the date change
    // store the date as a unix time stamp
    const handleDateChange = (date) => {
        setDate(date);
        console.log(date);
    };

    return (
        <div>
            {openButton}
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <Grid>
                        <Typography variant="h5">Overview</Typography>
                        {/* <Grid item xs={5}>
                            <Chart data={chartData}>
                                <PieSeries valueField="value" argumentField="argument" innerRadius={0.6} />
                            </Chart>
                        </Grid> */}
                        <Grid>
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
                            <Typography>Reward</Typography>
                            <RadioGroup row value={reward} onChange={(event) => { setReward(event.target.value) }}>
                                <FormControlLabel label="10" value="10" control={<Radio />} />
                                <FormControlLabel label="20" value="20" control={<Radio />} />
                                <FormControlLabel label="30" value="30" control={<Radio />} />
                                <FormControlLabel label="40" value="40" control={<Radio />} />
                                <FormControlLabel label="50" value="50" control={<Radio />} />
                            </RadioGroup>

                            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    label="DatePicker"
                                    inputVariant="outlined"
                                    value={date}
                                    onChange={handleDateChange}
                                />
                            </MuiPickersUtilsProvider> */}
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    label="Basic example"
                                    value={date}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <br />
                            {editButton}
                            {deleteButton}
                            {cancelButton}
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
}