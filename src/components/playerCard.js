import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import PlayerModal from "./playerModal.js";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../utils/firebase';

export default function PlayerCard({ player, user, classroomID }) {
   const [name, setName] = useState(player.name);
   const [avatar, setAvatar] = useState(player.avatar);
   const [money, setMoney] = useState(player.money);
   const [role, setRole] = useState(player.role);
   console.log(player.id)
   const playerRef = doc(db, `classrooms/${classroomID}/players/${player.id}`);
   onSnapshot(playerRef, (doc)=>{
      setName(doc.data().name);
   })

   return (
      <Card>
         <CardContent>
            <Typography variant="h5" component="div">{name}</Typography>
            <Typography variant="h6" component="div">Email: {user.email}</Typography>
            <Typography variant="h6" component="div">Money: {money}</Typography>
         </CardContent>
         <CardActions>
            <PlayerModal player={player} user={user} classroomID={classroomID} type="edit"/>
         </CardActions>
      </Card>
   );
}
