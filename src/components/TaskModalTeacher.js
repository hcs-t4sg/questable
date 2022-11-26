import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FormControlLabel, Radio, RadioGroup, Modal, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
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

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fromUnixTime } from 'date-fns';
import { getUnixTime } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';

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
        setDate(fromUnixTime(task.due));
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
            due: getUnixTime(date),
            reward: reward,
            id: task.id,
        }
        // Call the `updateTask` mutation
        updateTask(classroom.id, updatedTask);
        handleClose();
    };


    const openButton = <IconButton onClick={handleClickOpen}>
        <EditIcon />
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

        setDate(date);
    };

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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Due Date"
                value={date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
            />
            </LocalizationProvider>
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
                {saveButton}
            </Grid>
            </Box>
        </Modal>
        </div>
    );
}