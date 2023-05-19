import { Tab, Tabs, Grid, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useState, useEffect } from 'react'
import ConfirmRepeatablesTable from './ConfirmRepeatablesTable'
import ConfirmTasksTable from './ConfirmTasksTable'
import ConfirmRewardsTable from './ConfirmRewardsTable'
import { Classroom, CompletedTask, RepeatableCompletion, Repeatable, Player } from '../../types'
import { useSnackbar } from 'notistack'
import {
	confirmTasks,
	confirmRepeatables,
	getPlayerData,
	getPlayerTaskCompletion,
	getRepeatableCompletionTimes,
	getUserData,
} from '../../utils/mutations'

import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../utils/firebase'

export default function ConfirmationTables({
	classroom,
	player,
}: {
	classroom: Classroom
	player: Player
}) {
	const [page, setPage] = useState(0)
	const [completedTasks, setCompletedTasks] = useState<CompletedTask[] | null>(null)
	const [completedRepeatables, setCompletedRepeatables] = useState<RepeatableCompletion[] | null>(
		null,
	)
	const [token, setToken] = useState('')

	const { enqueueSnackbar } = useSnackbar()

	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

	const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => {
		setPage(newTabIndex)
	}

	useEffect(() => {
		// TODO repeated code - context thing eventually?
		const tokenRef = doc(db, 'users', player.id)
		const fetchToken = async () => {
			const getToken = await getDoc(tokenRef)

			if (getToken.exists()) {
				const tokenData = getToken.data()
				setToken(tokenData.gcrToken)
				console.log(token)
			} else {
				window.alert('Log into Google on the Settings page!')
			}
		}
		fetchToken().catch(console.error)
	}, [])

	useEffect(() => {
		if (page == 0) {
			const completedTasksQuery = query(
				collection(db, `classrooms/${classroom.id}/tasks`),
				where('completed', '!=', []),
			)
			const unsub = onSnapshot(completedTasksQuery, (snapshot) => {
				const fetchCompletedTasks = async () => {
					const completedTasksList: CompletedTask[] = []

					await Promise.all(
						snapshot.docs.map(async (doc) => {
							const completedPlayerList = doc.data().completed as string[]
							await Promise.all(
								completedPlayerList.map(async (playerID) => {
									const completionTime = await getPlayerTaskCompletion(
										classroom.id,
										doc.id,
										playerID,
									)
									const player = await getPlayerData(classroom.id, playerID)

									if (completionTime && player) {
										const completedTask = {
											...doc.data(),
											id: doc.id,
											player,
											completionTime,
										}
										completedTasksList.push(completedTask as CompletedTask)
									}
								}),
							)
						}),
					)

					console.log(completedTasksList)
					setCompletedTasks(completedTasksList)
				}
				fetchCompletedTasks().catch(console.error)
			})

			return unsub
		} else {
			const repeatablesRef = collection(db, `classrooms/${classroom.id}/repeatables`)
			const repeatablesWithPendingRequestsQuery = query(
				repeatablesRef,
				where('requestCount', '>', 0),
			)

			const unsub = onSnapshot(repeatablesWithPendingRequestsQuery, (snapshot) => {
				const fetchCompletedRepeatables = async () => {
					const allCompletedRepeatables: RepeatableCompletion[] = []

					console.log(snapshot.docs)

					await Promise.all(
						snapshot.docs.map(async (doc) => {
							console.log(doc.data())
							const completionTimes = await getRepeatableCompletionTimes(classroom.id, doc.id)

							await Promise.all(
								completionTimes.map(async (completionTime) => {
									const player = await getPlayerData(classroom.id, completionTime.playerID)

									if (player) {
										const repeatableCompletion = {
											id: completionTime.id,
											repeatable: { ...doc.data(), id: doc.id } as Repeatable,
											player: player,
											time: completionTime.time,
										}

										allCompletedRepeatables.push(repeatableCompletion)
									}
								}),
							)
						}),
					)

					setCompletedRepeatables(allCompletedRepeatables)
				}
				fetchCompletedRepeatables().catch(console.error)
			})

			return unsub
		}
	}, [classroom, page])

	const handleConfirmAll = () => {
		if (completedTasks && page == 0) {
			confirmTasks(completedTasks, classroom.id)
				.then(() => {
					enqueueSnackbar('All tasks confirmed', { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar('There was an error confirming the task completion.', {
						variant: 'error',
					})
				})
		}

		if (completedRepeatables && page != 0) {
			confirmRepeatables(completedRepeatables, classroom.id)
				.then(() => {
					enqueueSnackbar('All tasks confirmed', { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar('There was an error confirming the repeatable completion.', {
						variant: 'error',
					})
				})
		}
	}

	async function getCourses() {
		// asking for variable before loaded (error upon refresh)
		if (token) {
			const response = fetch('https://classroom.googleapis.com/v1/courses/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
			console.log(response)

			return (await response).json()
		}
	}

	async function getStudents(courseID: string) {
		console.log(token)
		const response = fetch(`https://classroom.googleapis.com/v1/courses/${courseID}/students`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		console.log(response)
		return (await response).json()
	}

	async function getSubmissions(courseId: string, courseWorkId: string) {
		const response = fetch(
			`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			},
		)
		console.log(response)
		return (await response).json()
	}

	async function processGCRTasks(courseID: string) {
		const gcrStudents = await getStudents(courseID)
		console.log(gcrStudents)
		if (gcrStudents.error) {
			window.alert('Oops, try logging into Google in Settings first!')
		} else {
			const studentList = gcrStudents.students
			console.log(studentList)
			// save profile section of array
			// https://stackoverflow.com/questions/12710905/how-do-i-dynamically-assign-properties-to-an-object-in-typescript
			const students: { [key: string]: string } = {}
			studentList.forEach((student: any) => {
				students[student.profile.emailAddress] = student.profile.id
			})

			console.log(students)

			if (completedTasks) {
				const tasksWithEmails = await Promise.allSettled(
					completedTasks.map(async (task) => {
						const playerData = await getUserData(task.player.id)
						if (!playerData) {
							throw new Error('Player not found')
						}
						const email = playerData.email
						const gcrUserId = students[email]
						if (!gcrUserId) {
							throw new Error('GCR User ID not found')
						}
						return {
							...task,
							email,
							gcrUserId,
						}
					}),
				)
				console.log(tasksWithEmails)
				const newTasks = tasksWithEmails.map((task: any) => {
					return task.value
				})
				console.log(newTasks)

				const confirmList: CompletedTask[] = []

				await Promise.allSettled(
					newTasks.map(async (task) => {
						console.log(task)
						if (task.gcrID && task.gcrCourseID && task.gcrUserId) {
							const submissions = await getSubmissions(task.gcrCourseID, task.gcrID)
							console.log(submissions)
							const submission = submissions.studentSubmissions.find(
								(s: any) => s.userId == task.gcrUserId,
							)
							console.log(submission)
							if (submission && submission.state == 'TURNED_IN') {
								console.log(task)
								confirmList.push(task as CompletedTask)
								console.log('done')
							}
						}
					}),
				)

				confirmTasks(confirmList, classroom.id)
			}
		}
	}

	return (
		<Grid item xs={12}>
			<Typography sx={{ fontSize: !mobile ? '32px' : '15px' }} variant='h4'>
				Tasks/Repeatables Awaiting Confirmation
			</Typography>
			<Stack direction='row' sx={{ justifyContent: 'space-between' }}>
				<Tabs value={page} onChange={handleTabChange}>
					<Tab sx={{ fontSize: !mobile ? '14px' : '8px' }} label='One Time' />
					<Tab sx={{ fontSize: !mobile ? '14px' : '8px' }} label='Repeatable' />
					<Tab sx={{ fontSize: !mobile ? '14px' : '8px' }} label='Reward' />
				</Tabs>
				<Stack direction='row'>
					<Button
						sx={{ mb: 2, mr: !mobile ? 1 : 0.25, fontSize: !mobile ? '14px' : '6px' }}
						color='primary'
						onClick={() => handleConfirmAll()}
					>
						Confirm All
					</Button>
					<Button
						sx={{ mb: 2, fontSize: !mobile ? '14px' : '6px' }}
						color='primary'
						onClick={async () => {
							// get all GCR courses for the teacher
							window.confirm('Confirm Google Classroom Tasks?')
							const classrooms = await getCourses()
							if (typeof classrooms.courses == 'undefined' || classrooms.courses.length == 0) {
								window.alert('Oops, classrooms not found! Try logging into Google in Settings!')
							} else {
								const courseIDs = classrooms.courses.map((course: any) => {
									return course.id
								})
								console.log(courseIDs)
								courseIDs.forEach((courseID: string) => processGCRTasks(courseID))
							}
						}}
					>
						Confirm Google Classroom Tasks
					</Button>
				</Stack>
			</Stack>

			{page === 0 ? (
				<ConfirmTasksTable classroom={classroom} completedTasks={completedTasks} />
			) : page === 1 ? (
				<ConfirmRepeatablesTable
					classroom={classroom}
					completedRepeatables={completedRepeatables}
				/>
			) : (
				<ConfirmRewardsTable classroom={classroom} />
			)}
		</Grid>
	)
}
