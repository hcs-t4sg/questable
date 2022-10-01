import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { updatePlayer } from '../utils/mutations';

export default function PlayerCard({ player, user, classroomID }) {
   const [name, setName] = useState(player.name);
   const [avatar,] = useState(player.avatar);
   const [money,] = useState(player.money);
   const [role,] = useState(player.role);

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
