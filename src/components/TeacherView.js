import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import * as React from 'react';
import ConfirmTasksTable from './ConfirmTasksTable';
import CreateTaskModal from './CreateTaskModal';
import TasksTableTeacher from './TasksTableTeacher';
import ManageTasksModal from './ManageTasksModal';

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from '../utils/firebase';
import { getUserData } from '../utils/mutations';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function TeacherView({ player, classroom, user }) {

    const [students, setStudents] = React.useState([]);
    const [teacher, setTeacher] = React.useState()

    React.useEffect(() => {

        // If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
        const playersRef = collection(db, `classrooms/${classroom.id}/players`);
        const playerQuery = query(playersRef);

        //Attach a listener to the teacher document
        onSnapshot(playerQuery, (snapshot) => {
            const mapTeacher = async () => {

                let players = await Promise.all(snapshot.docs.map(async (player) => {
                    const email = (await getUserData(player.id)).email;
                    return { ...player.data(), id: player.id, email: email };
                }))

                // Await the resolution of all promises in the returned array
                // and then store them in the `students` state variable
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
                for (let i = 0; i < players.length; i++) {
                    if (players[i].role == "teacher") {
                        setTeacher(players[i]);
                        players.splice(i, 1);
                    }
                }
                setStudents(players);
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
                    <Typography variant="body1">Name: {teacher?.name}</Typography>
                    <Typography variant="body1">Email: {teacher?.email}</Typography>
                </CardContent>
            </Card>

            {students?.map((student)=>(
                <Card>
                <CardContent>
                    <Typography variant="body1">Avatar: {student.avatar}</Typography>
                    <Typography variant="body1">Name: {student.name}</Typography>
                    <Typography variant="body1">Email: {student.email}</Typography>
                    <Typography variant="body1">Money: {student.money}</Typography>
                    <ManageTasksModal classroom={classroom} student={student}/>
                </CardContent>
                </Card>
            ))}
        </Grid>
    )
}