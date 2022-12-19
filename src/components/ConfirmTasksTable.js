import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, getDocs, getDoc } from "firebase/firestore";
import { db } from '../utils/firebase';
import { denyTask, confirmTask, completeRepeatable, denyRepeatable, confirmRepeatable } from '../utils/mutations'
import { Tabs, Tab } from '@mui/material';
import { getUnixTime, formatDistanceToNow, format } from 'date-fns';

function truncate(description) {
   if (description.length > 40) {
      return description.slice(0, 40) + "..."
   }
   return description;
}

export default function ConfirmTasksTable({ classroom }) {
   const [completedTasks, setCompletedTasks] = useState([])
   const [completedRepeatables, setCompletedRepeatables] = useState([]);
   const [completionTimes, setCompletionTimes] = useState([]);
   const [playerData, setPlayerData] = useState(null)

   const [page, setPage] = useState(0);


   useEffect(() => {
      // fetch player information
      const q = query(collection(db, `classrooms/${classroom.id}/players`))
      onSnapshot(q, snapshot => {
         const playerDataFetch = async () => {
            const queryRes = []
            snapshot.forEach(doc => {
               // attach player ID to doc data for each player and push into array.
               queryRes.push(Object.assign({ id: doc.id }, doc.data()))
            })
            setPlayerData(queryRes)
         }
         playerDataFetch().catch(console.error);
      })

      // fetch task information
      const qt = query(collection(db, `classrooms/${classroom.id}/tasks`))
      onSnapshot(qt, snapshot => {
         const cTaskFetch = async () => {
            const queryRes = []
            snapshot.forEach(async doc => {
               // append completion times to each task
               const completionTimes = [];
               const completionsQuery = query(collection(db, `classrooms/${classroom.id}/tasks/${doc.id}/completionTimes`));

               const completionsList = await getDocs(completionsQuery);

               console.log(completionsList);
               completionsList.forEach(item => {
                  completionTimes.push({ id: item.id, ...item.data() })
               })

               // onSnapshot(completionsQuery, completion => {
               //    completion.forEach(async item => {
               //       completionTimes.push({ id: item.id, ...item.data() })
               //    })
               // });
               queryRes.push(Object.assign({ id: doc.id }, { ...doc.data(), completionTimes: completionTimes }))
            })
            setCompletedTasks(queryRes)
            console.log(completedTasks);
         }
         cTaskFetch().catch(console.error)
      })

      const qr = query(collection(db, `classrooms/${classroom.id}/repeatables`));
      onSnapshot(qr, snapshot => {
         const cRepeatablesFetch = async () => {
            const queryRes = [];
            snapshot.forEach(async doc => {
               // Query the completions collection for each repeatable and store that data in an array.
               const completions = [];
               const completionsQuery = query(collection(db, `classrooms/${classroom.id}/repeatables/${doc.id}/completions`));
               onSnapshot(completionsQuery, completion => {
                  completion.forEach(async item => {
                     completions.push({ id: item.id, ...item.data() });
                  })
               })

               queryRes.push(Object.assign({ id: doc.id }, { ...doc.data(), completions: completions }));

            })

            setCompletedRepeatables(queryRes);
         }
         cRepeatablesFetch().catch(console.error);
      })


   }, [classroom.id])

   const handleTabChange = (event, newTabIndex) => {
      setPage(newTabIndex);
   };

   const getPlayerNameFromID = (id) => {
      const player = playerData.filter(player => player.id === id);
      if (player.length <= 0) {
         return "Player not found";
      }
      return player[0].name;
   }

   const formatStatus = (task, playerID) => {
      if (!task || !playerID) {
         return "Loading..."
      }

      const completionTimes = task.completionTimes;

      const playerCompletion = completionTimes.filter(completion => completion.id === playerID);
      console.log(playerCompletion);

      // TODO fix late day time
      console.log(task);
      console.log(playerCompletion[0].time.seconds);
      console.log(task.dueDate);
      if (playerCompletion[0].time.seconds > task.due) {
         return formatDistanceToNow(playerCompletion[0].time.seconds) + " late";
      } else {
         return "On time";
      }



      // console.log(task);
      // console.log(playerID);
      // console.log(task.completionTimes);
      // console.log("length");
      // console.log(task.completionTimes.length);
      // console.log(task.completionTimes[0]);
      // task.completionTimes.forEach(time => {
      //    console.log("124");
      //    console.log(time.id);
      //    console.log(playerID);
      //    if (time.id === playerID) {
      //       console.log("true");
      //       // if overdue, return "___ days late"
      //       if (time.time.seconds > task.dueDate) {
      //          return formatDistanceToNow(time.time.seconds) + " late";
      //       }
      //       else {
      //          return "On time";
      //       }
      //    }
      // })
      // console.log("136");
      // console.log(task.completionTimes);
      // console.log(playerID);
      // return "Player not found";
   }

   return (
      <Grid item xs={12}>
         <Typography variant="h4">Tasks Awaiting Confirmation</Typography>

         <Tabs value={page} onChange={handleTabChange}>
            <Tab label="One Time" />
            <Tab label="Repeatable" />
         </Tabs>

         {(page == 0) ?
            // One Time Tasks
            <TableContainer component={Paper}>
               <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                     <TableRow>
                        <TableCell align="center">Task</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Reward</TableCell>
                        <TableCell align="center">Student</TableCell>
                        <TableCell align="center">Confirm?</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {/* For each task, map over player IDs in completed array, then map over players with IDs in that array. */}
                     {completedTasks.map(task => {
                        return (task.completed?.map(playerID => {
                           const playersCompleted = playerData.filter(player => player.id === playerID)
                           return (playersCompleted.map(player => (
                              <TableRow key={'test'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                 <TableCell align="center">{task.name}</TableCell>
                                 <TableCell align="center">{truncate(task.description)}</TableCell>
                                 <TableCell align="center">{formatStatus(task, player.id)}</TableCell>
                                 <TableCell align="center">{task.reward}</TableCell>
                                 <TableCell align="center" component="th" scope="row">{player.name}</TableCell>
                                 <TableCell align="center">
                                    <Button onClick={() => confirmTask(classroom.id, player.id, task.id)} variant="contained">Confirm</Button>
                                    <Button onClick={() => denyTask(classroom.id, player.id, task.id)} variant="contained" color="error">Deny</Button>
                                 </TableCell>
                              </TableRow>
                           )))
                        })
                        )
                     })}
                  </TableBody>
               </Table>
            </TableContainer>
            :
            // Repeatable Tasks
            <TableContainer component={Paper}>
               <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                     <TableRow>
                        <TableCell align="center">Task</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Reward</TableCell>
                        <TableCell align="center">Student</TableCell>
                        <TableCell align="center">Confirm?</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {/* For each task, map over player IDs in completed array, then map over players with IDs in that array. */}
                     {completedRepeatables.map(repeatable => {
                        return (repeatable.completions.map(completion => {
                           const playerName = getPlayerNameFromID(completion.id);
                           const rows = [];
                           for (let i = 0; i < completion.completions; i++) {
                              rows.push(
                                 <TableRow key={'test'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center">{repeatable.name}</TableCell>
                                    <TableCell align="center">{truncate(repeatable.description)}</TableCell>
                                    <TableCell align="center">{repeatable.reward}</TableCell>
                                    <TableCell align="center" component="th" scope="row">{playerName}</TableCell>
                                    <TableCell align="center">
                                       <Button onClick={() => confirmRepeatable(classroom.id, completion.id, repeatable.id)} variant="contained">Confirm</Button>
                                       <Button onClick={() => denyRepeatable(classroom.id, completion.id, repeatable.id)} variant="contained" color="error">Deny</Button>
                                    </TableCell>
                                 </TableRow>)
                           }
                           return rows;
                        })
                        )
                     })}
                  </TableBody>
               </Table>
            </TableContainer>
         }
      </Grid>
   )
}