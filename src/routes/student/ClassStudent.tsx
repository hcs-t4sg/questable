import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import * as React from "react";

import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { getUserData } from "../../utils/mutations";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { User } from "firebase/auth";
import Avatar from "../../components/Avatar";
import { Classroom, Player, PlayerWithEmail } from "../../types";
import { currentAvatar } from "../../utils/items";

export default function ClassStudent({
  player,
  classroom,
  user,
}: {
  player: Player;
  classroom: Classroom;
  user: User;
}) {
  const [students, setStudents] = React.useState<PlayerWithEmail[]>([]);

  const [numStudents, setNumStudents] = React.useState<number | null>(0);

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
    // TODO: Rewrite the promise.all call to prune the rejected users from the output array, not reject everything
    onSnapshot(playerQuery, (snapshot) => {
      const mapTeacher = async () => {
        const players = await Promise.all(
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

        // Await the resolution of all promises in the returned array
        // and then store them in the `students` state variable
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

        // remove hte teacher from the playersList
        // for (let i = 0; i < players.length; i++) {
        //   if (players[i].role == "teacher") {
        //     players.splice(i, 1);
        //   }
        // }
        const studentList = players.filter(
          (player) => player.role !== "teacher"
        );

        setStudents(studentList);
      };
      // Call the async `mapTeacher` function
      mapTeacher().catch(console.error);
    });
  }, []);

  console.log(students);

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
            <Typography variant="body1">{student.email}</Typography>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}
