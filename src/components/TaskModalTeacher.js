import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { doc, onSnapshot } from "firebase/firestore";
import * as React from 'react';
import { useState } from 'react';
import { db } from '../utils/firebase';
import { deleteTask, getPlayerData, updateTask } from '../utils/mutations';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

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

    const openButton = <IconButton onClick={handleClickOpen}>
        <OpenInNewIcon />
    </IconButton>;

    

    const saveButton = <Button onClick={handleEdit} variant="contained">Save Changes</Button>;
    const closeButton = <IconButton onClick={handleClose}><CloseIcon /></IconButton>;

    const [completed, setCompleted] = React.useState([]);

    const [chartData, setChartData] = React.useState([]);

    React.useEffect(() => {

        const taskRef = doc(db, `classrooms/${classroom.id}/tasks/${task.id}`);

        // Attach a listener to the tasks collection
        onSnapshot(taskRef, (snapshot) => {

            const numCompleted = snapshot.data()?.completed.length;
            const numAssigned = snapshot.data()?.assigned.length;
            const numConfirmed = snapshot.data()?.confirmed.length;
            const total = numAssigned+numCompleted+numConfirmed;
            // check if values are definied then check if there will not be a divide by 0 error
            if (!(numCompleted === undefined || numAssigned === undefined || numConfirmed === undefined || total === 0)) {
                setChartData(numConfirmed/total);
            }else{
                setChartData(0);
            }
        })
    });
    function CircularProgressWithLabel(props) {
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" component="div" color="text.secondary">
                {`${Math.round(props.value)}%`}
              </Typography>
            </Box>
          </Box>
        );
      }
      
      CircularProgressWithLabel.propTypes = {
        /**
         * The value of the progress indicator for the determinate variant.
         * Value between 0 and 100.
         * @default 0
         */
        value: PropTypes.number.isRequired,
      };

    // function to handle the date change
    // store the date as a unix time stamp
    const handleDateChange = (date) => {
        setDate(date.getTime());
    };

    return (
        <div>
            {openButton}
            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { width: "50%", height: "100%" } }}>
                <DialogContent>
                    <Grid>
                        <Grid container justifyContent="flex-begin">
                        <Typography variant="h5">Overview</Typography>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            {closeButton}
                        </Grid>
                        <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
                            <CircularProgressWithLabel variant="indeterminant" thickness="1.25" size="20vh" value={chartData}/>
                        </Grid>
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
                            </MuiPickersUtilsProvider>
                            <br /> */}

                            {/* center the save button */}
                            <Grid container justifyContent="center">
                                {saveButton}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
}