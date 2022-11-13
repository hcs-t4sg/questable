import { Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from '../../utils/firebase';
import TasksTableStudent from '../../components/TasksTableStudent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function Main({classroom, player}) {
   const [assigned, setAssigned] = useState([])
   const [completed, setCompleted] = useState([])
   const [confirmed, setConfirmed] = useState([])
   const [filter, setFilter] = useState('all')
   const [filteredTasks, setFilteredTasks] = useState(null)

   useEffect(() => {
      // fetch task information
      const q = query(collection(db, `classrooms/${classroom.id}/tasks`))
      onSnapshot(q, snapshot => {
         const taskFetch = async () => {
            const assigned = []
            const completed = []
            const confirmed = []
            snapshot.forEach(doc => {
               // Find assigned, completed, and confirmed tasks using player's id.
               if(doc.data().assigned?.includes(player.id)) {
                  assigned.push(Object.assign({id: doc.id, status: 'Not Done'}, doc.data()))
               }
               if (doc.data().completed?.includes(player.id)) {
                  completed.push(Object.assign({ id: doc.id, status: 'Confirmation Requested' }, doc.data()))
               }
               if (doc.data().confirmed?.includes(player.id)) {
                  confirmed.push(Object.assign({ id: doc.id, status: 'Confirmed' }, doc.data()))
               }
            })
            setAssigned(assigned)
            setCompleted(completed)
            setConfirmed(confirmed)
         }
         taskFetch().catch(console.error)
      })
   }, [classroom.id, player.id])
    
    function a11yProps(index) {
      return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
    }
    
   const handleChange = (_, newValue) => {
      setFilter(newValue)
      if(newValue === 'all'){
         setFilteredTasks(assigned.concat(completed).concat(confirmed))
      }
      else if (newValue === 'assigned'){
         setFilteredTasks(assigned)
      }
      else if (newValue === 'completed'){
         setFilteredTasks(completed)
      }
      else if (newValue === 'confirmed'){
         setFilteredTasks(confirmed)
      }
   };
    
   return (
      <>
        <Typography sx={{marginBottom: '20px'}} variant="h4">All</Typography>
        <Box sx={{ width: '100%' }}>
          <Box>
            <Tabs value={filter} onChange={handleChange} aria-label="tabs" sx={{border: 0, backgroundColor: 'white'}}>
              <Tab value={'all'} label="All" {...a11yProps(0)} />
              <Tab value={'assigned'} label="Assigned" {...a11yProps(1)} />
              <Tab value={'completed'} label="Completed" {...a11yProps(2)} />
              <Tab value={'confirmed'} label="Confirmed" {...a11yProps(3)} />
            </Tabs>
          </Box>
        </Box>
        <TasksTableStudent filter={filter} tasks={filteredTasks || assigned.concat(completed).concat(confirmed)} player={player} classroom={classroom} />
      </>
   )

}