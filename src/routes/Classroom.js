import { getAuth } from "firebase/auth";
import { onSnapshot, doc } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import StudentView from '../components/StudentView';
import TeacherView from '../components/TeacherView';
import { db } from '../utils/firebase';
import { getPlayerData, syncUsers } from "../utils/mutations";

export default function Classroom({ user }) {

   // Use react router to fetch class ID from URL params
   let params = useParams();
   const classID = params.classID;

   // Synchronize user's player information for classroom
   const [player, setPlayer] = React.useState(null);
   React.useEffect(() => {
      const syncPlayer = async () => {
         const auth = getAuth();
         const user = auth.currentUser;
         if (!!user) {
            syncUsers(user);
         }
      }
      syncPlayer().catch(console.error);
   }, [classID]);


   React.useEffect(() => {
      const playerRef = doc(db, `classrooms/${classID}/players/${user.uid}`)

      onSnapshot(playerRef, (doc) => {
         console.log({ ...doc.data(), id: doc.id });
         setPlayer({ ...doc.data(), id: doc.id });
      })
   }, [user, classID]);


   // Listen to classroom data
   const [classroom, setClassroom] = React.useState([]);
   React.useEffect(() => {

      const classroomRef = doc(db, "classrooms", classID);

      onSnapshot(classroomRef, (doc) => {
         setClassroom({ ...doc.data(), id: doc.id });
      })

   }, [user, classID])


   // Display variable views depending on player role (teacher/student)
   if (player?.role === "teacher") {
      return <TeacherView user={user} player={player} classroom={classroom} />
   } else if (player?.role === "student") {
      return <StudentView user={user} player={player} classroom={classroom} />
   } else {
      return null
   }
}