import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Classroom, Player } from "../../types";
import { db } from "../../utils/firebase";
import PlayerModal from "./PlayerModal";

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
  // const [money, setMoney] = useState(player.money);
  // const [role, setRole] = useState(player.role);

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
          Money: {player.money}
        </Typography>
      </CardContent>
      <CardActions>
        <PlayerModal player={player} user={user} classroom={classroom} />
      </CardActions>
    </Card>
  );
}
