import * as React from 'react';
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import ClassSettings from '../routes/teacher/ClassSettings';
import ClassTeacher from '../routes/teacher/ClassTeacher';
import Requests from '../routes/teacher/Requests';
import Tasks from '../routes/teacher/Tasks';
import Layout from './Layout.js';

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
