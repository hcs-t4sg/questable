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
import Layout from '../components/Layout.js';
import Box from '@mui/material/Box';
import CreateClassroomModal from '../components/CreateClassroomModal';
import JoinClassroomModal from '../components/JoinClassroomModal';

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
   const [joinedClassrooms, setJoinedClassrooms] = React.useState([]);
   useEffect(() => {
      const q = query(collection(db, "classrooms"), where("playerList", "array-contains", user?.uid));

      onSnapshot(q, (snapshot) => {
         const classroomsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
         setJoinedClassrooms(classroomsList);
      })
   }, [user])


   // listen to created classrooms
   const [createdClassrooms, setCreatedClassrooms] = React.useState([]);
   useEffect(() => {
      const q = query(collection(db, "classrooms"), where("teacher", "==", user?.uid));

      onSnapshot(q, (snapshot) => {
         const classroomsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
         setCreatedClassrooms(classroomsList);
      })
   }, [user]);

   return (
      <Layout>
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
                     textAlign: "center",
                  }}
               >
                  <Typography variant="h3" sx={{ flex: '100%', }}>Welcome Back!</Typography>
                  <JoinClassroomModal user={user} sx={{ flex: '10%' }} />
                  <CreateClassroomModal user={user} sx={{ flex: '10%' }} />
               </Box>
            </Grid>
            <Grid item xs={12}>
               <Typography variant="h5" sx={{ flex: '100%', }}>Pinned Classrooms</Typography>
            </Grid>
            <Grid item xs={12}>
               <Typography variant="h5" sx={{ flex: '100%', }}>Joined Classrooms</Typography>
            </Grid>
            {joinedClassrooms.map((classroom) => (
               <Grid item xs={12} sm={6} md={4} key={classroom.id}>
                  <ClassroomCard className={classroom.name} classID={classroom.id} />
               </Grid>
            ))}
            <Grid item xs={12}>
               <Typography variant="h5" sx={{ flex: '100%', }}>Created Classrooms</Typography>
            </Grid>
            {createdClassrooms.map((classroom) => (
               <Grid item xs={12} sm={6} md={4} key={classroom.id}>
                  <ClassroomCard className={classroom.name} classID={classroom.id} />
               </Grid>
            ))}

         </Grid>
      </Layout>
   )
}