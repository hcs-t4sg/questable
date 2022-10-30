import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';
import ConfirmTasksTable from '../../components/ConfirmTasksTable';
import CreateTaskModal from '../../components/CreateTaskModal';
import TasksTableTeacher from '../../components/TasksTableTeacher';
import firebase from 'firebase/compat/app';
import PlayerCard from '../../components/PlayerCard';

import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../../utils/firebase';

import { collection, query, where } from "firebase/firestore";
import { getUserData } from '../../utils/mutations';


export default function Tasks({ player, classroom, user }) {

    const [numStudents, setNumStudents] = React.useState();

    const classroomRef = doc(db, `classrooms/${classroom.id}`);
    onSnapshot(classroomRef, (doc) => {
        setNumStudents(doc.data().playerList.length - 1);
    })
    const [teacher, setTeacher] = React.useState()

    React.useEffect(() => {

        // If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
        const playersRef = collection(db, `classrooms/${classroom.id}/players`);
        const teacherQuery = query(playersRef, where('role', '==', 'teacher'));

        //Attach a listener to the teacher document
        onSnapshot(teacherQuery, (snapshot) => {
            const mapTeacher = async () => {

                const teacher = await Promise.all(snapshot.docs.map(async (player) => {
                    const email = (await getUserData(player.id)).email;
                    return { ...player.data(), id: player.id, email: email };
                }))[0]
                setTeacher(teacher);
            }

            // Call the async `mapTeacher` function
            mapTeacher().catch(console.error);
        })
    }, []);

    return (
        <Grid container spacing={3} sx={{ p: 5 }}>
            <Grid item xs={12}>
                <Typography variant="h2" component="div">{classroom.name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Card sx={{ width: 1 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">{player.name}</Typography> {/*Do we want a separate user name?*/}
                        <Typography variant="h5" component="div">{numStudents} Total Students</Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Typography variant="h5">Create a New Task</Typography>
                <CreateTaskModal classroom={classroom} player={player} />
            </Grid>

            <Grid item xs={12}>
                <Typography variant="h5">View and Edit Tasks</Typography>
                <TasksTableTeacher classroom={classroom} />
            </Grid>
        </Grid>
    )
}