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

    React.useEffect(() => {

        // If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
        const playersRef = collection(db, `classrooms/${classroom.id}/players`);
        const teacherQuery = query(playersRef, where('role', '==', 'teacher'));

        //Attach a listener to the teacher document
        onSnapshot(teacherQuery, (snapshot) => {
            const mapTeacher = async () => {

                let teachers = await Promise.all(snapshot.docs.map(async (player) => {
                    const email = (await getUserData(player.id)).email;
                    return { ...player.data(), id: player.id, email: email };
                }))

                // Await the resolution of all promises in the returned array
                // and then store them in the `students` state variable
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
                console.log("yeet");
                console.log(teachers);
                setTeacher(teachers[0]);
            }

            // Call the async `mapTeacher` function
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