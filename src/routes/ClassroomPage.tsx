import { getAuth, User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import StudentView from '../components/student/StudentView'
import TeacherView from '../components/teacher/TeacherView'
import { db } from '../utils/firebase'
import { getPlayerData, syncUsers } from '../utils/mutations'
import { Player, Classroom } from '../types'
import { useState, useEffect } from 'react'
import Layout from '../components/global/Layout'
import { Grid } from '@mui/material'
import Loading from '../components/global/Loading'

export default function ClassroomPage({ user }: { user: User }) {
	// Use react router to fetch class ID from URL params
	const params = useParams()
	const classID = params.classID

	// Listen to classroom data
	const [classroom, setClassroom] = useState<Classroom | null>(null)
	useEffect(() => {
		// If you don't check for classID you get a 'No overload matches this call' error. Function overloading in Typescript is when there are multiple functions with the same name but different parameter types and return type. Without checking for the existence of classID, the type is string | undefined. Firebase does not have an overload for the doc() function that includes a possible classID (document id) input that is string | undefined.
		// ! I don't know if the unsub cleanup works here if written in a conditional statement
		if (classID) {
			const classroomRef = doc(db, 'classrooms', classID)

			const unsub = onSnapshot(classroomRef, (doc) => {
				if (doc.exists()) {
					setClassroom({ ...doc.data(), id: doc.id } as Classroom)
				}
			})
			return unsub
		}
	}, [user, classID])

	// Fetch user's player information for classroom
	const [player, setPlayer] = useState<Player | null>(null)
	useEffect(() => {
		const updatePlayer = async () => {
			const auth = getAuth()
			const user = auth.currentUser
			if (!!user && classID) {
				syncUsers(user)
				const playerData = await getPlayerData(classID, user.uid)
				if (playerData) setPlayer(playerData)
			}
		}
		updatePlayer().catch(console.error)
	}, [classID])

	if (classroom) {
		if (player) {
			if (player.role === 'teacher') {
				return <TeacherView player={player} classroom={classroom} user={user} />
			} else if (player.role === 'student') {
				return <StudentView player={player} classroom={classroom} />
			} else {
				return <p>Error: Player role does not exist or is invalid.</p>
			}
		} else {
			return (
				<Layout>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Loading>Loading player data...</Loading>
						</Grid>
					</Grid>
				</Layout>
			)
		}
	} else {
		return (
			<Layout>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Loading>Loading classroom data...</Loading>
					</Grid>
				</Grid>
			</Layout>
		)
	}
}
