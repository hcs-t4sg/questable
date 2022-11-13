import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import React from "react";
import TaskModalStudent from './TaskModalStudent';

export default function TasksTableStudent({ tasks, classroom, player }) {
   return (
      <Grid item xs={12}>
         <TableContainer sx={{backgroundColor: 'white'}}>
            <Table aria-label="simple table" sx={{border: 'none'}}>
               <TableHead>
                  <TableRow>
                     <TableCell>Avatar</TableCell>
                     <TableCell>Quest Name</TableCell>
                     <TableCell>Description</TableCell>
                     <TableCell>Deadline</TableCell>
                     <TableCell align="center">Reward Amount</TableCell>
                     <TableCell align="center">Status</TableCell>
                     <TableCell align="center"/>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {tasks.map((task) => (
                     <TableRow
                        key={task.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                     >
                        <TableCell align="left">{task.avatar || "N/A"}</TableCell>
                        <TableCell align="left">{task.name}</TableCell>
                        <TableCell align="left">{task.description || "None"}</TableCell>
                        <TableCell align="left">{task.due}</TableCell>
                        <TableCell align="center">${task.reward}</TableCell>
                        <TableCell align="center">
                           <Chip label={task.status} />
                        </TableCell>
                        <TableCell align="center">
                           <TaskModalStudent task={task} classroom={classroom} player={player} />
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Grid>
   )
}