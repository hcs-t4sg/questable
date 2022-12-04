import * as React from 'react';
import { useState } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Typography,
  Box,
  IconButton,
  Modal,
  Button
} from '@mui/material';
import sprite1 from '../utils/tempAssets/sprite1.svg';
import { completeTask } from '../utils/mutations';
import CloseIcon from '@mui/icons-material/Close';

export default function TaskModalStudent({ classroom, player, task }) {
  // State variables
  const [open, setOpen] = useState(false);

  // Open the task modal
  const handleClickOpen = () => {
    setOpen(true);
  };
  // Close the task modal
  const handleClose = () => {
    setOpen(false);
  };

  // Handle task completion
  const handleComplete = () => {
    // Call the `completeTask` mutation
    if (window.confirm("Are you sure you want to mark this task as complete?")) {
      completeTask(classroom.id, task.id, player.id)
    }
  }

  const Cluster = ({ title, data }) => (
    <>
      <Typography sx={{ marginTop: '25px' }} fontWeight="medium" variant="h7">{title}</Typography>
      <Typography fontWeight="light" variant="h7">{data}</Typography>
    </>
  )

  const openButton =
    <IconButton onClick={handleClickOpen}>
      <OpenInNewIcon />
    </IconButton>

  return (
    <div>
      {openButton}
      <Modal sx={{ overflow: "scroll" }} open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '35px',
          paddingTop: '25px',
          backgroundColor: 'white',
          marginBottom: '18px',
        }}
        >
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography fontWeight='light' variant="h5">Overview</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <hr
            style={{
              backgroundColor: '#D9D9D9',
              height: '1px',
              borderWidth: '0px',
              borderRadius: '5px',
              width: '100%',
              marginBottom: '35px'
            }}
          />
          <Box
            component="img"
            sx={{
              width: '15%',
              // height: '30%',
              maxHeight: '200px',
              maxWidth: '200px',
              marginBottom: '24px'
            }}
            alt="User's avatar"
            src={sprite1}
          />
          <Typography sx={{ textAlign: 'center', maxWidth: '400px' }} fontWeight="light" variant="h6">Flavored Text: Strawberry Vanilla Chocolate!</Typography>
          <Box sx={{ width: '100%', flexDirection: 'column', display: 'flex', justifyContent: 'left' }}>
            <Cluster title="Task Name" data={task.name} />
            <Cluster title="Description" data={task.description} />
            <Cluster title="Deadline" data={task.due} />
            <Cluster title="Reward Amount" data={`$${task.reward}`} />
            {task.status === 'assigned' ? (<Cluster title="Completion" data={<Button onClick={handleComplete} variant="contained">Mark as complete</Button>} />)
              : <Cluster title="Completion" data={task.status === 'completed' ? 'Marked as completed!' : task.status === 'confirmed' ? 'Confirmed!' : 'Unavailable'} />
            }
          </Box>
        </Box>
      </Modal>
    </div>
  );
}