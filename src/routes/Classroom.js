import { useParams } from "react-router-dom";
import React from "react";
import { syncUsers, getPlayerData } from "../utils/mutations";
import { getAuth } from "firebase/auth";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { db } from '../utils/firebase';
import StudentView from '../components/StudentView';
import TeacherView from '../components/TeacherView';

export default function Classroom({ user }) {

   let params = useParams();
   const classID = params.classID;

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

   const [classroom, setClassroom] = React.useState([]);
   React.useEffect(() => {

      const classroomRef = doc(db, "classrooms", classID);

      // const q = query(collection(db, "classrooms"), where("playerList", "array-contains", user?.uid));

      onSnapshot(classroomRef, (doc) => {
         console.log({ ...doc.data(), id: doc.id });
         setClassroom({ ...doc.data(), id: doc.id });
      })
   }, [user, classID])


   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography variant="h2">{classroom.name}</Typography>
         </Grid>
         {player?.role == "teacher" ? <TeacherView player={player} classroom={classroom} /> : player?.role == "student" ? <StudentView player={player} classroom={classroom} /> : null}
      </Grid>
   )

}