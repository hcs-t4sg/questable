import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { updatePlayer } from '../utils/mutations';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';


export default function PlayerModal({ player, user, classroomID }) {
   const [open, setOpen] = useState(false);
   const [isEditing, setIsEditing] = useState(false);

   const [name, setName] = useState(player.name);
   const [avatar, setAvatar] = useState(player.avatar);
   const [money, setMoney] = useState(player.money);
   const [role, setRole] = useState(player.role);

   const handleEdit = () => {
      const newPlayer = {
         name: name,
      };
   
      updatePlayer(user.uid, classroomID, newPlayer).catch(console.error);
      handleClose();
   };

   const handleClickOpen = () => {
      setOpen(true);
      setName(player.name);
      setAvatar(player.avatar);
      setMoney(player.money);
      setRole(player.role);
   };

   const handleClose = () => {
       setIsEditing(false);
       setOpen(false);
   };

   const openButton = <IconButton onClick={handleClickOpen}>Edit Profile<OpenInNewIcon /></IconButton>

   return (
    <div>
         {openButton}
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
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


                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" onClick={handleEdit} sx={{ display: isEditing ? 'inline' : 'none' }}>Confirm</Button>
                        <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ display: isEditing ? 'none' : 'inline' }}>Edit</Button>
                    </DialogActions>
                </Card>
            </DialogContent>
        </Dialog>
    </div>
   );
}
