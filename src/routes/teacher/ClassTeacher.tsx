import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import * as React from "react";
import ClassTeacherModal from "../../components/ClassTeacherModal";

import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { getUserData } from "../../utils/mutations";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "../../components/Avatar";
import { currentAvatar } from "../../utils/items";
import { Classroom, Player, PlayerWithEmail } from "../../types";
import { User } from "firebase/auth";

export default function ClassTeacher({
  player,
  classroom,
  user,
}: {
  player: Player;
  classroom: Classroom;
  user: User;
}) {
  const [students, setStudents] = React.useState<PlayerWithEmail[]>([]);
  //   const [teacher, setTeacher] = React.useState();

  const [numStudents, setNumStudents] = React.useState();

  const classroomRef = doc(db, `classrooms/${classroom.id}`);
  onSnapshot(classroomRef, (doc) => {
    if (doc.exists()) {
      setNumStudents(doc.data().playerList.length);
    }
  });

  React.useEffect(() => {
    // If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
    const playersRef = collection(db, `classrooms/${classroom.id}/players`);
    const playerQuery = query(playersRef);

    //Attach a listener to the teacher document
    onSnapshot(playerQuery, (snapshot) => {
      const mapTeacher = async () => {
        // * Rewritten from a forEach call. old code commented
        let players = await Promise.all(
          snapshot.docs.map(async (player) => {
            const playerData = await getUserData(player.id);
            if (!playerData) {
              throw new Error("Player not found");
            }
            const email = playerData.email;
            return {
              ...player.data(),
              id: player.id,
              email: email,
            } as PlayerWithEmail;
          })
        );

        // let players = [];
        // for (const player of snapshot.docs) {
        //   const playerData = await getUserData(player.id);
        //   if (playerData) {
        //     const email = playerData.email;
        //     players.push({
        //       ...player.data(),
        //       id: player.id,
        //       email: email,
        //     } as PlayerWithEmail);
        //   }
        // }

        if (players) {
          // Await the resolution of all promises in the returned array
          // and then store them in the `students` state variable
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

          // remove hte teacher from the playersList
          const playersWithoutTeacher = players.filter(
            (player) => player.role !== "teacher"
          );

          setStudents(playersWithoutTeacher);
        }
      };
      // Call the async `mapTeacher` function
      mapTeacher().catch(console.error);
    });
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h2" component="div">
          {classroom.name}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ width: 1 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {player.name}
            </Typography>{" "}
            {/*Do we want a separate user name?*/}
            <Typography variant="h5" component="div">
              {numStudents} Total Students
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {students?.map((student) => (
        <Card sx={{ width: 0.22, m: 2 }}>
          <CardContent>
            <Box
              sx={{
                height: 200,
                width: 200,
              }}
            >
              <Avatar outfit={currentAvatar(student)} />
            </Box>
            <Typography variant="body1">Name: {student.name}</Typography>
            <Typography variant="body1">
              Account Balance: {student.money}
            </Typography>
            <Typography variant="body1">{student.email}</Typography>
            <ClassTeacherModal classroom={classroom} student={student} />
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}
