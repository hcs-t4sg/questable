import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, PurchasedReward } from '../../types'
import { db } from '../../utils/firebase'
import { confirmReward } from '../../utils/mutations/shop'
import { StyledTableRow } from '../../styles/TaskTableStyles'
import { Grid } from '@mui/material'
import Loading from '../global/Loading'
import { useSnackbar } from 'notistack'

// Table showing purchased custom shop rewards that are pending confirmation

export default function ConfirmRewardsTable({ classroom }: { classroom: Classroom }) {
	const { enqueueSnackbar } = useSnackbar()

	const [rewards, setRewards] = useState<PurchasedReward[] | null>(null)

	// Listen to reward requests
	useEffect(() => {
		const rewardsQuery = query(collection(db, `classrooms/${classroom.id}/rewardRequests`))

		const unsub = onSnapshot(rewardsQuery, (snapshot) => {
			setRewards(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as PurchasedReward)))
		})

		return unsub
	}, [classroom])

	if (!rewards) {
		return <Loading>Loading rewards...</Loading>
	}

	return (
		<TableContainer component={Paper}>
			<Table aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell>Reward</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Price</TableCell>
						<TableCell>Student</TableCell>
						<TableCell>Confirm?</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rewards.map((reward) => (
						<StyledTableRow key={'test'}>
							<TableCell>{reward.rewardName}</TableCell>
							<TableCell>{reward.rewardDescription}</TableCell>
							<TableCell>{`${reward.rewardPrice}g`}</TableCell>
							<TableCell component='th' scope='row'>
								{reward.playerName}
							</TableCell>
							<TableCell align='center'>
								<Grid container columnSpacing={1}>
									<Grid item>
										<Button
											onClick={() =>
												confirmReward(classroom.id, reward.playerID, reward.id)
													.then(() => {
														enqueueSnackbar(
															`Confirmed purchase "${reward.rewardName}" from ${reward.playerName}!`,
															{ variant: 'success' },
														)
													})
													.catch((err) => {
														console.error(err)
														enqueueSnackbar('There was an error confirming the purchase.', {
															variant: 'error',
														})
													})
											}
											color='success'
										>
											Confirm
										</Button>
									</Grid>
								</Grid>
							</TableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
