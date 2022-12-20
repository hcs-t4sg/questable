import { Typography, Box, Button, IconButton, Icon } from '@mui/material';
import placeholderAvatar from '../../utils/tempAssets/oval.png'
import checkboxChecked from '../../utils/tempAssets/checkboxChecked.svg'
import checkboxEmpty from '../../utils/tempAssets/checkboxUnchecked.svg'
import { completeTask, completeRepeatable } from '../../utils/mutations';
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, getDoc, doc } from "firebase/firestore";
import { db } from '../../utils/firebase';
import TaskModalStudent from '../../components/TaskModalStudent'
import { set } from 'date-fns';
import { Tabs, Tab } from '@mui/material';
import TasksTableStudent from '../../components/TasksTableStudent';
import { Table, TableCell, TableContainer, TableRow, TableBody, TableHead } from '@mui/material';
import Paper from '@mui/material/Paper';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DoneIcon from '@mui/icons-material/Done';
import { format, fromUnixTime } from 'date-fns';


export default function RepeatableTableStudent() {

   return (
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
   )
}