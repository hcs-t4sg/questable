import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import IconButton from "@mui/material/IconButton";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { Classroom, Player } from "../../types";

export default function ClassTeacherModal({
  classroom,
  student,
}: {
  classroom: Classroom;
  student: Player;
}) {
  // const [confirmedTasks, setConfirmedTasks] = React.useState([]);

  // React.useEffect(() => {
  //   // If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
  //   const taskRef = collection(db, `classrooms/${classroom.id}/tasks`);

  //   //Attach a listener to the confirmed tasks document
  //   onSnapshot(taskRef, (snapshot) => {
  //     const mapTasks = async () => {
  //       let tasks = await Promise.all(
  //         snapshot.docs.map(async (doc) => {
  //           console.log("Current data: ", doc.data());
  //         })
  //       );
  //     };
  //     // Call the async `mapTeacher` function
  //     mapTasks().catch(console.error);
  //   });
  // }, []);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openButton = (
    <IconButton onClick={handleClickOpen}>
      <OpenInNewIcon />
    </IconButton>
  );

  return (
    <Grid item xs={6}>
      {openButton}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{student.name}</DialogTitle>
        <Box
          component="img"
          sx={{
            height: 50,
            width: 50,
          }}
          alt={`Avatar ${student.avatar}`}
          src={`../../static/${student.avatar}.png`}
        />
        <DialogContent></DialogContent>
      </Dialog>
    </Grid>
  );
}
