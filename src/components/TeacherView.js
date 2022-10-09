import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import ConfirmTasksTable from './ConfirmTasksTable';
import CreateTaskModal from './CreateTaskModal';
import TasksTableTeacher from './TasksTableTeacher';

export default function TeacherView({ player, classroom, user }) {

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h2">{classroom.name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h2">Teacher View</Typography>
                <Typography variant="h3">{player.name}</Typography>
            </Grid>
            <CreateTaskModal classroom={classroom} user={user} />
            <TasksTableTeacher classroom={classroom} />
            <ConfirmTasksTable classroom={classroom} />
        </Grid>
    )
}