import * as React from 'react';
import { useState } from 'react';
import { completeTask } from '../utils/mutations';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { 
    Typography, 
    Box, 
    IconButton,
    Button, 
    Modal, 
} from '@mui/material';
import sprite1 from '../utils/tempAssets/sprite1.svg'
import crossButton from '../utils/tempAssets/crossButton.svg'
import CloseIcon from '@mui/icons-material/Close';



export default function TaskModalStudent({ task, classroom, player }) {
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

    const Cluster = ({title, data}) => (
      <>
        <Typography sx={{marginTop: '30px'}} fontWeight="medium" variant="h7">{title}</Typography>
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
            <Box
              component="img"
              sx={{
                width: '30%',
                height: '40%',
                maxHeight: '100px',
                maxWidth: '100px',
                marginBottom: '24px'
              }}
              alt="User's avatar"
              src={sprite1}
            />
          <Typography sx={{textAlign: 'center', maxWidth: '400px'}} fontWeight="light" variant="h5">Flavored Text: Strawberry Vanilla Chocolate!</Typography>
          <Box sx={{width:'100%', flexDirection: 'column', display: 'flex', justifyContent: 'left'}}>
            <Cluster title="Task Name" data={task.name}/>
            <Cluster title="Description" data={task.description}/>
            <Cluster title="Deadline" data={task.due}/>
            <Cluster title="Reward Amount" data={`$${task.reward}`}/>
          </Box>
        </Box>
       </Modal>
    </div>
 );
}