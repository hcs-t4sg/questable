import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { updatePlayer } from "../utils/mutations";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Classroom, Player } from "../types";
import { User } from "firebase/auth";

export default function PlayerModal({
  player,
  user,
  classroom,
}: {
  player: Player;
  user: User;
  classroom: Classroom;
}) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(player.name);
  const [avatar, setAvatar] = useState(player.avatar);
  const [money, setMoney] = useState(player.money);
  const [role, setRole] = useState(player.role);

  const handleEdit = () => {
    const newPlayer = {
      name: name,
      avatar: avatar,
    };

    updatePlayer(user.uid, classroom.id, newPlayer).catch(console.error);
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
    setName(name);
    setAvatar(avatar);
    setMoney(money);
    setRole(role);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openButton = (
    <IconButton onClick={handleClickOpen}>
      Edit Profile
      <OpenInNewIcon />
    </IconButton>
  );

  return (
    <div>
      {openButton}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
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
            disabled={true}
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

          <RadioGroup
            row
            id="avatar"
            name="Player Avatar"
            onChange={(event) => {
              setAvatar(parseInt(event.target.value));
            }}
            value={avatar}
            defaultValue={player.avatar}
          >
            <FormControlLabel
              label={
                <img
                  src="../../static/0.png"
                  alt="Avatar 0"
                  width="50"
                  height="50"
                />
              }
              value="0"
              control={<Radio />}
            />
            <FormControlLabel
              label={
                <img
                  src="../../static/1.png"
                  alt="Avatar 1"
                  width="50"
                  height="50"
                />
              }
              value="1"
              control={<Radio />}
            />
            <FormControlLabel
              label={
                <img
                  src="../../static/2.png"
                  alt="Avatar 2"
                  width="50"
                  height="50"
                />
              }
              value="2"
              control={<Radio />}
            />
          </RadioGroup>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={() => handleEdit()}>
              Edit
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
