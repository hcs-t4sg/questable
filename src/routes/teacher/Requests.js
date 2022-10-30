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


export default function Requests({ player, classroom, user }) {

    const [numStudents, setNumStudents] = React.useState();

    const classroomRef = doc(db, `classrooms/${classroom.id}`);
    onSnapshot(classroomRef, (doc) => {
        setNumStudents(doc.data().playerList.length - 1);
    })

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

            <ConfirmTasksTable classroom={classroom} />
        </Grid>
    )
}