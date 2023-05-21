import { Tab, Tabs, Grid, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useState, useEffect } from 'react'
import ConfirmRepeatablesTable from '../../components/teacher/ConfirmRepeatablesTable'
import ConfirmTasksTable from '../../components/teacher/ConfirmTasksTable'
import ConfirmRewardsTable from '../../components/teacher/ConfirmRewardsTable'
import { Classroom, CompletedTask, RepeatableCompletion, Repeatable, Player } from '../../types'
import { useSnackbar } from 'notistack'
import { getPlayerData, getUserData } from '../../utils/mutations/users'
import { confirmTasks, getPlayerTaskCompletionTime } from '../../utils/mutations/tasks'
import { confirmRepeatables, getRepeatableCompletionTimes } from '../../utils/mutations/repeatables'

import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../utils/firebase'

// Route for displaying requests for task completions, repeatable completions, and custom reward purchases

export default function Requests({ classroom, player }: { classroom: Classroom; player: Player }) {
	const [page, setPage] = useState(0)
	// List of all completions consisting of a task and the player who completed it
	const [completedTasks, setCompletedTasks] = useState<CompletedTask[] | null>(null)
	// List of all completions consisting of a repeatable and the player who completed it
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

	// Fetch user-specific Google API token from database, which was previously obtained and saved in the database in the google login process
	useEffect(() => {
		// TODO repeated code - Eventually refactor with similar code in CreateGCRTask
		const tokenRef = doc(db, 'users', player.id)
		const fetchToken = async () => {
			const getToken = await getDoc(tokenRef)

			if (getToken.exists()) {
				const tokenData = getToken.data()
				setToken(tokenData.gcrToken)
			} else {
				window.alert('Log into Google on the Settings page!')
			}
		}
		fetchToken().catch(console.error)
	}, [])

	// Listen for pending task completions
	useEffect(() => {
		// Query for tasks with nonempty completed array
		const completedTasksQuery = query(
			collection(db, `classrooms/${classroom.id}/tasks`),
			where('completed', '!=', []),
		)
		const unsub = onSnapshot(completedTasksQuery, (snapshot) => {
			const fetchCompletedTasks = async () => {
				const completedTasksList: CompletedTask[] = []
				// Fetch player data for all player ids in the completed array of each task, and construct CompletedTask object for each player-task completion
				await Promise.all(
					snapshot.docs.map(async (doc) => {
						const completedPlayerList = doc.data().completed as string[]
						await Promise.all(
							completedPlayerList.map(async (playerID) => {
								const completionTime = await getPlayerTaskCompletionTime(
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

				setCompletedTasks(completedTasksList)
			}
			fetchCompletedTasks().catch(console.error)
		})

		return unsub
	}, [classroom])

	// Listen for pending repeatable completions
	useEffect(() => {
		// Listen for repeatables where the request count is greater than 0.
		// ! Note that this repeatable fetching relies on requestCount being updated whenever a repeatable is completed!
		const repeatablesRef = collection(db, `classrooms/${classroom.id}/repeatables`)
		const repeatablesWithPendingRequestsQuery = query(repeatablesRef, where('requestCount', '>', 0))

		const unsub = onSnapshot(repeatablesWithPendingRequestsQuery, (snapshot) => {
			const fetchCompletedRepeatables = async () => {
				const allCompletedRepeatables: RepeatableCompletion[] = []
				// For each queried repeatable, obtain the list of completion times (player + time pairing). For all completions, append the player data and the time and add to allCompletedRepeatables
				await Promise.all(
					snapshot.docs.map(async (doc) => {
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
	}, [classroom])

	// Mass confirm all task and repeatable completions
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

	// Obtain the list of user's courses in their Google classroom account
	async function getGCRCourses() {
		// asking for variable before loaded (error upon refresh)
		if (token) {
			const response = await fetch('https://classroom.googleapis.com/v1/courses/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})

			return response.json()
		}
	}

	// For a particular GCR course, get data of all students in the course
	async function getGCRStudents(courseID: string) {
		const response = await fetch(
			`https://classroom.googleapis.com/v1/courses/${courseID}/students`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			},
		)
		return response.json()
	}

	// For a particular assignment in a particular GCR course, get the data for that assignment
	async function getGCRSubmissions(courseId: string, courseWorkId: string) {
		const response = await fetch(
			`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			},
		)
		return response.json()
	}

	const handleConfirmGCRTasks = async () => {
		// get all GCR courses for the teacher
		window.confirm('Confirm Google Classroom Tasks?')
		const classrooms = await getGCRCourses()
		if (typeof classrooms.courses == 'undefined' || classrooms.courses.length == 0) {
			window.alert('Oops, classrooms not found! Try logging into Google in Settings!')
		} else {
			const courseIDs = classrooms.courses.map((course: any) => {
				return course.id
			})
			courseIDs.forEach((courseID: string) => processGCRTasks(courseID))
		}
	}

	// Mass process all GCR-linked tasks and confirm/deny based on submission status of corresponding GCR assignment for each student
	async function processGCRTasks(courseID: string) {
		// Fetch students in GCR
		const gcrStudents = await getGCRStudents(courseID)
		if (gcrStudents.error) {
			window.alert('Oops, try logging into Google in Settings first!')
		}
		// Construct mapping between student email address and GCR ID
		const studentList = gcrStudents.students
		// save profile section of array
		// https://stackoverflow.com/questions/12710905/how-do-i-dynamically-assign-properties-to-an-object-in-typescript
		const students: { [key: string]: string } = {}
		studentList.forEach((student: any) => {
			students[student.profile.emailAddress] = student.profile.id
		})

		if (completedTasks) {
			// Append player email to all task completions
			const tempTasksWithEmails = await Promise.allSettled(
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
						gcrUserId, // Google Classroom user id for the player of the task completion in question
					}
				}),
			)
			const taskCompletionsWithEmails = tempTasksWithEmails.map((task: any) => {
				return task.value
			})

			// For all task completions, verify that the completing player's email has a corresponding submission for the assignment in GCR, and if so, confirm the task
			const confirmList: CompletedTask[] = []
			await Promise.allSettled(
				taskCompletionsWithEmails.map(async (task) => {
					if (task.gcrID && task.gcrCourseID && task.gcrUserId) {
						const submissions = await getGCRSubmissions(task.gcrCourseID, task.gcrID)
						const submission = submissions.studentSubmissions.find(
							(s: any) => s.userId == task.gcrUserId,
						)
						if (submission && submission.state == 'TURNED_IN') {
							confirmList.push(task as CompletedTask)
						}
					}
				}),
			)

			// TODO: Add functionality for denying completion requests if the student has not submitted the corresponding GCR assignment
			confirmTasks(confirmList, classroom.id)
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
						onClick={handleConfirmGCRTasks}
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
