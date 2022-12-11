import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from "react-router-dom";
import { addPin, deletePin } from '../utils/mutations';

export default function ClassroomCard({ className, classID, pinned, userid }) {
   return (
      <Card>
         <CardActionArea component={Link} to={`/class/${classID}`}>
         <CardContent>
            <Typography variant="h5" component="div">
               {className}
            </Typography>
         </CardContent>
         </CardActionArea>
         <CardActions>
            {pinned &&
            <Button size="small" onClick={() => deletePin(userid, classID)}>Unpin Classroom</Button>
            }
            {!pinned &&
            <Button size="small" onClick={() => addPin(userid, classID)}>Pin Classroom</Button>
            }
         </CardActions>
      </Card>
   );
}
