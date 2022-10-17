import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import * as React from 'react';
import ConfirmTasksTable from './ConfirmTasksTable';
import CreateTaskModal from './CreateTaskModal';
import TasksTableTeacher from './TasksTableTeacher';

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from '../utils/firebase';
import { getUserData } from '../utils/mutations';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function TeacherView({ player, classroom, user }) {

    const [teacher, setTeacher] = React.useState()

    const playersRef = collection(db, `classrooms/${classroom.id}/players`);

    React.useEffect(() => {
  
        const teacherQuery = query(playersRef, where('role', '==', 'teacher'));
        //Attach a listener to the teacher document
        onSnapshot(teacherQuery, (snapshot)=>{
           const mapTeacher = async () => {
              // Map the task id's to the task data using `getTaskData`
              const teachers = await snapshot.docs.map(async (doc)=>{
                 //Append the player's email to the student struct
                 console.log("doc.id: " + doc.id)
                 console.log("user data of doc id: " + getUserData(doc.id))
                 const email = (await getUserData(doc.id)).email;
                 return {...doc.data(), id: doc.id, email: email};
              }); 
              // Await the resolution of all promises in the returned array
              // and then store them in the `students` state variable
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
              setTeacher((await Promise.all(teachers))[0]);
           }
  
           // Call the async `mapTasks` function
           mapTeacher().catch(console.error);
        })
    }, []);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h1">{classroom.name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h2">Teacher View</Typography>
                <Typography variant="h3">{player.name}</Typography>
            </Grid>
            <CreateTaskModal classroom={classroom} user={user} />
            <TasksTableTeacher classroom={classroom} />
            <ConfirmTasksTable classroom={classroom} />
            <Card>
            <CardContent>
               <Typography variant="body1">Name: {player.name}</Typography>
               <Typography variant="body1">email: {player.email}</Typography>
            </CardContent>
         </Card>
        </Grid>
    )
}