import React from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { addClassroom } from '../utils/mutations';

export default function Classrooms() {

   const [newClassroomName, setNewClassroomName] = React.useState("");
   const [signupCode, setSignupCode] = React.useState("");

   const handleAddClassroom = () => {
      addClassroom(newClassroomName);
      setNewClassroomName("");
   }

   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h2">Classrooms</Typography>
         </Grid>
         <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
               <TextField id="signup-code" label="Signup Code" variant="standard" onChange={(event) => setSignupCode(event.target.value)} />
               <Button variant="contained">Join Classroom</Button>
            </Stack>
         </Grid>
         <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
               <TextField id="classroom-name" label="Classroom Name" variant="standard" onChange={(event) => setNewClassroomName(event.target.value)} value={newClassroomName} />
               <Button variant="contained" onClick={handleAddClassroom}>Create Classroom</Button>
            </Stack>
         </Grid>
      </Grid>
   )
}