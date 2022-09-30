import { getAuth } from "firebase/auth";
import { setDoc, updateDoc, query,  where, onSnapshot, doc, getDocs, addDoc, deleteDoc,  collection, getDoc } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";
import StudentView from '../components/StudentView';
import TeacherView from '../components/TeacherView';
import { db } from '../utils/firebase';
import { getPlayerData, syncUsers } from "../utils/mutations";
import {  useState } from "react";

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


   // Display variable views depending on player role (teacher/student)
   if (player?.role === "teacher") {
      return <TeacherView player={player} classroom={classroom} />
   } else if (player?.role === "student") {
      return <StudentView player={player} classroom={classroom} />
   } else {
      return null
   }
}