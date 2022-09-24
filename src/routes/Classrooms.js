import React from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { addClassroom, joinClassroom } from '../utils/mutations';
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { db } from '../utils/firebase';
import ClassroomCard from '../components/classroomCard';

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

   const [classrooms, setClassrooms] = React.useState([]);
   React.useEffect(() => {

      const q = query(collection(db, "classrooms"), where("playerList", "array-contains", user?.uid));

      onSnapshot(q, (snapshot) => {
         const classroomsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
         console.log(classroomsList);
         setClassrooms(classroomsList);
      })

      // const userRef = doc(db, "users", user.uid);
      // onSnapshot(userRef, (doc) => {
      //    console.log(doc.data());
      //    const classroomList = doc.data().classrooms;

      // })
      // const classroomsList = 
      // const q = "query here";

      // onSnapshot(q, (snapshot) => {
      //    setClassrooms(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
      // })
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
            <Grid item xs={12} sm={6} md={4}>
               <ClassroomCard className={classroom.name} id={classroom.id} />
            </Grid>
         ))}
      </Grid>
   )
}