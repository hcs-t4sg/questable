import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import ConfirmTasksTable from './ConfirmTasksTable';
import CreateTaskModal from './CreateTaskModal';
import TasksTableTeacher from './TasksTableTeacher';
import Layout from './Layout.js';
import { Link, Route, Routes, Outlet, Navigate } from "react-router-dom";
import ClassSettings from '../routes/teacher/ClassSettings';
import ClassTeacher from '../routes/teacher/ClassTeacher';
import Requests from '../routes/teacher/Requests';
import Tasks from '../routes/teacher/Tasks';

export default function TeacherView({ player, classroom, user }) {

    return (
        <Layout classroom role={player?.role}>
            <Routes>
                <Route path="/" element={<Navigate to="tasks" />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="requests" element={<Requests />} />
                <Route path="class-teacher" element={<ClassTeacher />} />
                <Route path="class-settings" element={<ClassSettings />} />
                <Route
                    path="*"
                    element={
                        <main style={{ padding: "1rem" }}>
                            <p>There's nothing here!</p>
                        </main>
                    }
                />
            </Routes>
            <Outlet />
        </Layout>
    )
}


{/* <Grid container spacing={3}>
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
            </Grid> */}