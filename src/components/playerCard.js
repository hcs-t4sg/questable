import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import firebase from 'firebase/compat/app';
import { useState } from 'react';
import { doc, addDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../utils/firebase';
import { updatePlayer } from '../utils/mutations';

export default function PlayerCard({ player, user, classroomID }) {
   const [name, setName] = useState(player.name);
   const [avatar, setAvatar] = useState(player.avatar);
   const [money, setMoney] = useState(player.money);
   const [role, setRole] = useState(player.role);

   const handleEdit = () => {
      const newPlayer = {
         name: name,
         avatar: avatar,
         money: money,
         role: role,
      };
   
      updatePlayer(player, user.uid, classroomID, newPlayer).catch(console.error);
   };

   return (
      <Card>
         <CardContent>
            <TextField
                  margin="normal"
                  id="name"
                  label="Player Name"
                  fullWidth
                  variant="standard"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
            />

            <TextField
                  margin="normal"
                  id="email"
                  label="Email"
                  fullWidth
                  variant="standard"
                  value={user.email}
                  disabled ={true}
            />

            <TextField
                  margin="normal"
                  id="money"
                  label="Money"
                  fullWidth
                  variant="standard"
                  value={player.money}
                  disabled={true}
            />
         </CardContent>

         <CardActions>
            <Button size="small" onClick={handleEdit()}>Update Info</Button>
         </CardActions>
      </Card>
   );
}
