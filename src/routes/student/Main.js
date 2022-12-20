import { Typography, Box, Button, IconButton, Icon } from '@mui/material';
import { completeTask, completeRepeatable } from '../../utils/mutations';
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, getDoc, doc } from "firebase/firestore";
import { db } from '../../utils/firebase';
import TasksTableStudent from '../../components/TasksTableStudent';
import { set } from 'date-fns';
import { Tabs, Tab } from '@mui/material';
import { Table, TableCell, TableContainer, TableRow, TableBody, TableHead } from '@mui/material';
import Paper from '@mui/material/Paper';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DoneIcon from '@mui/icons-material/Done';
import { format, fromUnixTime } from 'date-fns';
import TaskModalStudent from '../../components/TaskModalStudent';

function truncate(description) {
   if (description.length > 50) {
      return description.slice(0, 50) + "..."
   }
   return description;
}

export default function Main({ classroom, player }) {
   const [assigned, setAssigned] = useState([])
   const [completed, setCompleted] = useState([])
   const [confirmed, setConfirmed] = useState([])
   const [filter, setFilter] = useState('all')
   const [filteredTasks, setFilteredTasks] = useState(null)
   const [overdue, setOverdue] = useState([]);
   const [repeatables, setRepeatables] = useState([]);

   // Boolean to show which page should be shown (tasks/repeatables)
   const [isRepeatables, setIsRepeatables] = useState(0);

   // Stores the currently active tasks page:
   // (0) All Quests
   // (1) Requested
   // (2) Confirmed
   // (3) Overdue
   // (4) Repeatables
   const [page, setPage] = useState(0);

   // Stores the currently active repeatables page
   // (0) All Repeatables
   const [repPage, setRepPage] = useState(0);

   // function to return array that contains only tasks where the player's completions is less than the max completions
   const filterMaxedOutRepeatables = (repeatables) => {
      let filteredArray = []
      repeatables.forEach(async (repeatable) => {
         const compRef = doc(db, `classrooms/${classroom.id}/repeatables/${repeatable.id}/completions/${player.id}`);
         const compSnap = await getDoc(compRef);
         const confRef = doc(db, `classrooms/${classroom.id}/repeatables/${repeatable.id}/confirmations/${player.id}`);
         const confSnap = await getDoc(confRef);
         if (compSnap.exists() || confSnap.exists()) {
            if (compSnap.data().completions + confSnap.data().confirmations < repeatable.maxCompletions) {
               filteredArray.push(repeatable);
            }
         }
      })
      return filteredArray;
   }

   useEffect(() => {
      // fetch task information
      const q = query(collection(db, `classrooms/${classroom.id}/tasks`))
      onSnapshot(q, snapshot => {
         const taskFetch = async () => {
            const assigned = []
            const completed = []
            const confirmed = []
            const overdue = []

            snapshot.forEach(doc => {
               // Find assigned, completed, and confirmed tasks using player's id.
               if (doc.data().assigned?.includes(player.id)) {
                  assigned.push(Object.assign({ id: doc.id, status: 'Not Done' }, doc.data()))
               }
               if (doc.data().completed?.includes(player.id)) {
                  completed.push(Object.assign({ id: doc.id, status: 'Confirmation Requested' }, doc.data()))
               }
               if (doc.data().confirmed?.includes(player.id)) {
                  confirmed.push(Object.assign({ id: doc.id, status: 'Confirmed' }, doc.data()))
               }
               // if task is overdue, add to overdue list
               if (doc.data().due < Date.now() / 1000) {
                  overdue.push(Object.assign({ id: doc.id }, doc.data()))
               }
            })
            setAssigned(assigned)
            setCompleted(completed)
            setConfirmed(confirmed);
            setOverdue(overdue);
         }
         taskFetch().catch(console.error)
      })

      const repeatableQuery = query(collection(db, `classrooms/${classroom.id}/repeatables`));
      onSnapshot(repeatableQuery, (snapshot) => {
         const repeatablesFetch = async () => {
            const repeatable = []
            snapshot.forEach(doc => {
               if (doc.data().assigned?.includes(player.id)) {
                  repeatable.push(Object.assign({ id: doc.id }, doc.data()))
               }
            })
            setRepeatables(filterMaxedOutRepeatables(repeatable));
         }
         repeatablesFetch().catch(console.error);
      })

   }, [classroom.id, player.id])

   const handleTaskComplete = (task) => {
      if (window.confirm("Are you sure you want to mark this task as complete?")) {
         completeTask(classroom.id, task.id, player.id)
      }
   }

   const handleRepeatableComplete = (repeatable) => {
      if (window.confirm("Are you sure you want to complete this repeatable task?")) {
         console.log(repeatable.id);
         completeRepeatable(classroom.id, repeatable.id, player.id);
      }
   }

   // functions to determine if a task is in a certain list
   const includesTask = (task, list) => {
      if (!task)
         return false;
      if (!list)
         return false;

      for (let i = 0; i < list.length; i++) {
         if (list[i].id === task.id) {
            return true;
         }
      }
      return false;
   }


   // Returns the quests that should be displayed on the page
   // NOTE: Overdue tasks are still in the "assigned", "completed", or "confirmed" lists, but they are *also* in the "overdue" list.

   const getQuests = () => {
      if (isRepeatables == 0) {
         switch (page) {
            case 0:
               return assigned.concat(completed).concat(confirmed);
            case 1:
               return [];
            case 2:
               return confirmed;
            case 3:
               return overdue;

            default:
               return [];
         }
      } else if (isRepeatables == 1) {
         switch (repPage) {
            case 0:
               return repeatables;
         }
      }
   }

   const handleTabChange = (event, newTabIndex) => {
      setPage(newTabIndex);
   };

   const handleIsRepChange = (event, newTabIndex) => {
      setIsRepeatables(newTabIndex);
   }
   const handleRepPageChange = (event, newTabIndex) => {
      setRepPage(newTabIndex);
   }

   const completeTaskButton = (task) => {
      return (
         (includesTask(task, completed) || includesTask(task, confirmed)) ?
            <IconButton><CheckBoxIcon /></IconButton> :
            <IconButton onClick={() => handleTaskComplete(task)}><CheckBoxOutlineBlankIcon /></IconButton>
      )
   }

   const completeRepeatableButton = (repeatable) => {
      return <IconButton onClick={() => { handleRepeatableComplete(repeatable) }}><DoneIcon /></IconButton>
   }

   function a11yProps(index) {
      return {
         id: `simple-tab-${index}`,
         'aria-controls': `simple-tabpanel-${index}`,
      };
   }

   const handleChange = (_, newValue) => {
      setFilter(newValue)
      if (newValue === 'all') {
         setFilteredTasks(assigned.concat(completed).concat(confirmed))
      }
      else if (newValue === 'assigned') {
         setFilteredTasks(assigned)
      }
      else if (newValue === 'completed') {
         setFilteredTasks(completed)
      }
      else if (newValue === 'confirmed') {
         setFilteredTasks(confirmed)
      }
   };

   return (
      <div style={{ marginLeft: '36px' }}>
         <Tabs value={isRepeatables} onChange={handleIsRepChange}>
            <Tab label="Tasks" />
            <Tab label="Repeatables" />
         </Tabs>

         {(isRepeatables == 0) ?

            <Tabs value={page} onChange={handleTabChange}>
               <Tab label="All Quests" />
               <Tab label="Requested" />
               <Tab label="Confirmed" />
               <Tab label="Overdue" />
            </Tabs>
            :
            <Tabs value={repPage} onChange={handleRepPageChange}>
               <Tab label="All Repeatables" />
            </Tabs>

         }

         <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
               <TableHead>
                  {
                     (isRepeatables == 0) ?
                        <TableRow>
                           <TableCell></TableCell>
                           <TableCell>Name</TableCell>
                           <TableCell>Reward</TableCell>
                           <TableCell>Deadline</TableCell>
                           <TableCell>Description</TableCell>
                           <TableCell></TableCell>
                        </TableRow> :
                        <TableRow>
                           <TableCell></TableCell>
                           <TableCell>Name</TableCell>
                           <TableCell>Reward</TableCell>
                           <TableCell>Description</TableCell>
                           <TableCell></TableCell>
                        </TableRow>
                  }
               </TableHead>
               <TableBody>
                  {getQuests().map((task) => (
                     (isRepeatables == 0) ?
                        <TableRow
                           key={task.id}
                           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                           <TableCell sx={{ "paddingTop": 0, "paddingBottom": 0, width: .01 }} align="left">
                              <TaskModalStudent task={task} classroom={classroom} />
                           </TableCell>
                           <TableCell component="th" scope="row">{task.name}</TableCell>
                           <TableCell align="left">{task.reward}</TableCell>
                           <TableCell align="left">{format(fromUnixTime(task.due), 'MM/dd/yyyy')}</TableCell>
                           <TableCell aligh="left">{truncate(task.description)}</TableCell>
                           <TableCell align="left">{completeTaskButton(task)}</TableCell>
                        </TableRow>
                        :
                        <TableRow
                           key={task.id}
                           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                           <TableCell sx={{ "paddingTop": 0, "paddingBottom": 0, width: .01 }} align="left">
                              <TaskModalStudent task={task} classroom={classroom} />
                           </TableCell>
                           <TableCell component="th" scope="row">{task.name}</TableCell>
                           <TableCell align="left">{task.reward}</TableCell>
                           <TableCell align="left">{truncate(task.description)}</TableCell>
                           <TableCell align="left">{completeRepeatableButton(task)}</TableCell>
                        </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>

         {/* {getQuests().map((task) => (
            <QuestCard task={task} />
         ))} */}

      </div>
   )

}










