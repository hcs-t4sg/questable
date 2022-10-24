import { getAuth } from "firebase/auth";
import { onSnapshot, doc } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import StudentView from '../components/StudentView';
import TeacherView from '../components/TeacherView';
import { db } from '../utils/firebase';
import { getPlayerData, syncUsers } from "../utils/mutations";
import Layout from "../components/Layout";
import { Link, Route, Routes, Outlet } from "react-router-dom";
import ClassSettings from './teacher/ClassSettings';
import ClassTeacher from './teacher/ClassTeacher';
import Requests from './teacher/Requests';
import Tasks from './teacher/Tasks';
import ClassStudent from "./student/ClassStudent";
import Main from "./student/Main";
import Shop from "./student/Shop";

export default function Classroom({ user }) {

   // Use react router to fetch class ID from URL params
   let params = useParams();
   const classID = params.classID;

   // Fetch user's player information for classroom
   const [player, setPlayer] = React.useState(null);
   React.useEffect(() => {
      const updatePlayer = async () => {
         const auth = getAuth();
         const user = auth.currentUser;
         if (!!user) {
            syncUsers(user);
            const playerData = await getPlayerData(classID, user.uid);
            setPlayer(playerData);
         }
      }
      updatePlayer().catch(console.error);
   }, [classID]);

   // Listen to classroom data
   const [classroom, setClassroom] = React.useState([]);
   React.useEffect(() => {

      const classroomRef = doc(db, "classrooms", classID);

      onSnapshot(classroomRef, (doc) => {
         setClassroom({ ...doc.data(), id: doc.id });
      })

   }, [user, classID])

   // if (!player) {
   //    return null
   // } else return (
   //    <Layout classroom role={player?.role}>
   //       <Routes>
   //          <Route path="tasks" element={<Tasks />} />
   //          <Route path="requests" element={<Requests />} />
   //          <Route path="class-teacher" element={<ClassTeacher />} />
   //          <Route path="class-settings" element={<ClassSettings />} />
   //          <Route path="main" element={<Main />} />
   //          <Route path="shop" element={<Shop />} />
   //          <Route path="class-student" element={<ClassStudent />} />
   //       </Routes>
   //       {player?.role === "teacher" ? <TeacherView player={player} classroom={classroom} user={user} /> : player?.role === "student" ? <StudentView player={player} classroom={classroom} /> : null}
   //    </Layout>
   // )
   // Display variable views depending on player role (teacher/student)
   if (player?.role === "teacher") {
      return <TeacherView player={player} classroom={classroom} user={user} />
   } else if (player?.role === "student") {
      return <StudentView player={player} classroom={classroom} />
   } else {
      return null
   }
}