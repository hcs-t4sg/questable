import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import Layout from './Layout.js';

import ClassStudent from '../routes/student/ClassStudent';
import Main from '../routes/student/Main';
import Shop from '../routes/student/Shop';

export default function StudentView({ player, classroom }) {

   return (
      <Layout classroom role={player?.role}>
         <Routes>
            <Route path="/" element={<Navigate to="main" />} />
            <Route path="main" element={<Main />} />
            <Route path="shop" element={<Shop />} />
            <Route path="class-student" element={<ClassStudent />} />
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