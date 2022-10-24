import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from '../utils/firebase';

export default function ManageTasksModal({ classroom, student }) {

    const [confirmedTasks, setConfirmedTasks] = React.useState([]);

    React.useEffect(() => {

        // If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
        const taskRef = collection(db, `classrooms/${classroom.id}/tasks`);

        //Attach a listener to the confirmed tasks document
        onSnapshot(taskRef, (snapshot) => {
            const mapTasks = async () => {

                let tasks = await Promise.all(snapshot.docs.map(async (doc) => {
                    console.log("Current data: ", doc.data());
                }))
            }
            // Call the async `mapTeacher` function
            mapTasks().catch(console.error);
        })
    }, []);

   const [open, setOpen] = useState(false);

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const openButton = <IconButton onClick={handleClickOpen}>
        <OpenInNewIcon />
    </IconButton>;

   return (
      <Grid item xs={12}>
         {openButton}
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Confirmed Tasks"}</DialogTitle>
            <DialogContent>
            </DialogContent>
         </Dialog>
      </Grid>
   )
}