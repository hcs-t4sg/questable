import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import ClassroomCard from '../components/ClassroomCard';
import { db } from '../utils/firebase';
import { useEffect } from "react"
import { addClassroom, joinClassroom } from '../utils/mutations';

export default function Classrooms({ user }) {

   const [newClassroomName, setNewClassroomName] = React.useState("");
   const [signupCode, setSignupCode] = React.useState("");

   const handleAddClassroom = () => {
      addClassroom(newClassroomName, user);
      setNewClassroomName("");
   }

   const handleJoinClassroom = () => {
      joinClassroom(signupCode, user).then((value) => {
         window.alert(value);
      });
      setSignupCode("");
   }

   // Listen to user's classrooms
   const [classrooms, setClassrooms] = React.useState([]);
   useEffect(() => {
      const q = query(collection(db, "classrooms"), where("playerList", "array-contains", user?.uid));

      onSnapshot(q, (snapshot) => {
         const classroomsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
         setClassrooms(classroomsList);
      })
   }, [user])

   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h2">Classrooms</Typography>
         </Grid>
         <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
               <TextField id="signup-code" label="Signup Code" variant="standard" onChange={(event) => setSignupCode(event.target.value)} value={signupCode} />
               <Button variant="contained" onClick={handleJoinClassroom}>Join Classroom</Button>
            </Stack>
         </Grid>
         <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
               <TextField id="classroom-name" label="Classroom Name" variant="standard" onChange={(event) => setNewClassroomName(event.target.value)} value={newClassroomName} />
               <Button variant="contained" onClick={handleAddClassroom}>Create Classroom</Button>
            </Stack>
         </Grid>
         {classrooms.map((classroom) => (
            <Grid item xs={12} sm={6} md={4} key={classroom.id}>
               <ClassroomCard className={classroom.name} classID={classroom.id} />
            </Grid>
         ))}
      </Grid>
   )
}