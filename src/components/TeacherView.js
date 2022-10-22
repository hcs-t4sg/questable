import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import firebase from 'firebase/compat/app';
import PlayerCard from '../components/playerCard';

export default function TeacherView({ player, classroom, user }) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h1">{classroom.name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h2">Teacher View</Typography>
                <Typography variant="h3">{player.name}</Typography>
            </Grid>
            <CreateTaskModal classroom={classroom} user={user} />
            <TasksTableTeacher classroom={classroom} />
            <ConfirmTasksTable classroom={classroom} />
        </Grid>
    )
}