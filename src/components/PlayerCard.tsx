import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import * as React from "react";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import PlayerModal from "./PlayerModal.js";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";
import Box from "@mui/material/Box";
import { Classroom, Player } from "../types.js";
import { User } from "firebase/auth";
import { useEffect } from "react";

export default function PlayerCard({
  player,
  user,
  classroom,
}: {
  player: Player;
  user: User;
  classroom: Classroom;
}) {
  const [name, setName] = useState(player.name);
  const [avatar, setAvatar] = useState(player.avatar);
  const [money, setMoney] = useState(player.money);
  const [role, setRole] = useState(player.role);

  useEffect(() => {
    const playerRef = doc(
      db,
      `classrooms/${classroom.id}/players/${player.id}`
    );
    onSnapshot(playerRef, (doc) => {
      if (doc.exists()) {
        setName(doc.data().name);
        setAvatar(doc.data().avatar);
      }
    });
  });
  return (
    <Card sx={{ width: 1 }}>
      <CardContent>
        <Box
          component="img"
          sx={{
            height: 50,
            width: 50,
          }}
          alt={`Avatar ${avatar}`}
          src={`../../static/${avatar}.png`}
        />
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="h6" component="div">
          Email: {user.email}
        </Typography>
        <Typography variant="h6" component="div">
          Money: {money}
        </Typography>
      </CardContent>
      <CardActions>
        <PlayerModal player={player} user={user} classroom={classroom} />
      </CardActions>
    </Card>
  );
}
