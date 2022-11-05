import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from "react-router-dom";

export default function ClassroomCard({ className, classID }) {
   return (
      <Card>
         <CardContent>
            <Typography variant="h5" component="div">
               {className}
            </Typography>
         </CardContent>
         <CardActions>
            <Button size="small" component={Link} to={`/class/${classID}`}>Select Classroom</Button>
         </CardActions>
      </Card>
   );
}
