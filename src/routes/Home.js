import React from "react";
import Grid from '@mui/material/Grid';
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import ClassroomCard from '../components/ClassroomCard';
import { db } from '../utils/firebase';
import { useEffect } from "react"
import { addClassroom, joinClassroom } from '../utils/mutations';
import JoinClassroomModal from './JoinClassroomModal';
import CreateClassroomModal from './CreateClassroomModal';

export default function Home({user}) {

   const [newClassroomName, setNewClassroomName] = React.useState("");
   const [signupCode, setSignupCode] = React.useState("");

   const handleClickOpen = () => {
      setNewClassroomName("");
      setSignupCode("");
   };

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
            <Box
               sx={{
               width: '100%',
               height: 300,
               backgroundColor: 'primary.dark',
               display: "flex",
               flexWrap: "wrap",
               justifyContent: "center",
               alignItems: "center",
               textAlign:"center",
               }}
            >
               <Typography variant="h3" sx={{flex: '100%',}}>Welcome Back!</Typography>
               <Button variant="contained" onClick={handleClickOpen} sx={{flex: '10%'}}>Join!</Button>
               <Button variant="contained" onClick={handleClickOpen} sx={{flex: '10%'}}>Create!</Button>
            </Box>
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h5" sx={{flex: '100%',}}>Pinned Classrooms</Typography>
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h5" sx={{flex: '100%',}}>Joined Classrooms</Typography>
         </Grid>
         <Grid item xs={12}>
            <Typography variant="h5" sx={{flex: '100%',}}>Created Classrooms</Typography>
         </Grid>
         <CreateClassroomModal />
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