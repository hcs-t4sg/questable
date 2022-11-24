import { Typography, Box, Button } from '@mui/material';
import placeholderAvatar from '../../utils/tempAssets/oval.png'
import checkboxChecked from '../../utils/tempAssets/checkboxChecked.svg'
import checkboxEmpty from '../../utils/tempAssets/checkboxUnchecked.svg'
import { completeTask } from '../../utils/mutations';
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from '../../utils/firebase';
import TaskModalStudent from '../../components/TaskModalStudent'
import { set } from 'date-fns';



export default function Main({classroom, player}) {
   const [assigned, setAssigned] = useState([]);
   const [completed, setCompleted] = useState([]);
   const [confirmed, setConfirmed] = useState([]);
   const [overdue, setOverdue] = useState([]);

   // Stores the currently active page:
   // (0) All Quests
   // (1) Requested
   // (2) Confirmed
   // (3) Overdue
   const [page, setPage] = useState(0);

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
               if(doc.data().assigned?.includes(player.id)) {
                  assigned.push(Object.assign({id: doc.id}, doc.data()))
               }
               if (doc.data().completed?.includes(player.id)) {
                  completed.push(Object.assign({ id: doc.id }, doc.data()))
               }
               if (doc.data().confirmed?.includes(player.id)) {
                  confirmed.push(Object.assign({ id: doc.id }, doc.data()))
               }
               // if task is overdue, add to overdue list
               if(doc.data().due < Date.now()) {
                  overdue.push(Object.assign({ id: doc.id }, doc.data()))
                  console.log(overdue);
               }
            })
            setAssigned(assigned)
            setCompleted(completed)
            setConfirmed(confirmed);
            setOverdue(overdue);
         }
         taskFetch().catch(console.error)
      })
   }, [classroom.id, player.id])

   const handleComplete = (task) => {
      if(window.confirm("Are you sure you want to mark this task as complete?")) {
         completeTask(classroom.id, task.id, player.id)
      }
   }
   
   // create a list of tasks to display based on the current page
   const QuestCard = ({task}) => {     
      return(
         <Box sx={{
            width: '100%',
            height: '154px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '35px',
            backgroundColor: '#D9D9D9',
            borderRadius: '20px',
            marginBottom: '18px',
         }}
         >
            <Box sx={{display: 'flex', alignItems: 'center'}}>
               <Box
                  component="img"
                  sx={{
                     width: '104px',
                     height: '100px',
                     marginRight: '40px'
                  }}
                  alt="User's avatar"
                  src={placeholderAvatar}
               />
               <Typography>{task && task.description}</Typography>
            </Box>
            <Box sx={{display: 'flex', flexDirection: confirmed.includes(task) ? 'column' : 'row', alignItems: 'center'}}>
               <Typography>${task && task.reward} Reward</Typography>
               <TaskModalStudent task={task} classroom={classroom} player={player} />
               {confirmed.includes(task) ? 
                  <Box 
                     sx={{
                        marginTop: '10px', 
                        backgroundColor:'#545454', 
                        color:'white', 
                        borderRadius: '2px', 
                        paddingLeft: '30px', paddingRight:'30px', paddingTop: '3px', paddingBottom: '3px'
                     }}
                  > 
                     Finished!
                  </Box> : 
               
                  <Box component="img" 
                     onClick={() => handleComplete(task)}
                     sx={{ height: '30px', marginLeft: '20px'}} 
                     src={completed.includes(task) ? checkboxChecked : checkboxEmpty}
                  />
               }
            </Box>
         </Box>
   )}

   // Returns the quests that should be displayed on the page
   const getQuests = () => {
      switch(page) {
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
   }

   return (
      <div style={{marginLeft: '36px'}}>
         <Button sx={{marginBottom: '22px'}} onClick={()=>{setPage(0)}} variant="h4">All Quests</Button>
         <Button sx={{marginBottom: '22px'}} onClick={()=>{setPage(1)}} variant="h4">Requested</Button> 
         <Button sx={{marginBottom: '22px'}} onClick={()=>{setPage(2)}} variant="h4">Confirmed</Button>
         <Button sx={{marginBottom: '22px'}} onClick={()=>{setPage(3)}} variant="h4">Overdue</Button>
         {getQuests().map((task) => (
            <QuestCard task={task} />
         ))}

      </div>
   )

}