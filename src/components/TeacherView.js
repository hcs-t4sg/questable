import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import ConfirmTasksTable from './ConfirmTasksTable';
import CreateTaskModal from './CreateTaskModal';
import TasksTableTeacher from './TasksTableTeacher';
import Layout from './Layout.js';

export default function TeacherView({ player, classroom, user }) {

    return (
        <Layout classroom role="teacher">
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
            </Grid>
        </Layout>
    )
}