import { Grid } from '@mui/material'
import { getAuth, User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/global/Layout'
import Loading from '../components/global/Loading'
import OnboardingPage from '../components/global/OnboardingPage'
import StudentView from '../components/student/StudentView'
import TeacherView from '../components/teacher/TeacherView'
import { Classroom, Player } from '../types'
import { db } from '../utils/firebase'

export default function ClassroomPage({ user }: { user: User }) {
	// Use react router to fetch class ID from URL params
	const params = useParams()
	const classID = params.classID

	// Listen to classroom data
	const [classroom, setClassroom] = useState<Classroom | null>(null)
	useEffect(() => {
		// If you don't check for classID you get a 'No overload matches this call' error. Function overloading in Typescript is when there are multiple functions with the same name but different parameter types and return type. Without checking for the existence of classID, the type is string | undefined. Firebase does not have an overload for the doc() function that includes a possible classID (document id) input that is string | undefined.
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

	const [player, setPlayer] = useState<Player | null>(null)
	useEffect(() => {
		const updatePlayer = async () => {
			const auth = getAuth()
			const user = auth.currentUser
			if (user && classID) {
				const playerRef = doc(db, `classrooms/${classID}/players/${user.uid}`)
				const unsub = onSnapshot(playerRef, (doc) => {
					if (doc.exists()) {
						console.log('player exists')
						setPlayer({ ...doc.data(), id: doc.id } as Player)
					}
				})
				console.log('player does not exist')
				return unsub
			}
		}
		updatePlayer().catch(console.error)
	}, [classID])

	const [onboarded, setOnboarded] = useState<string[] | null>(null)
	useEffect(() => {
		const unsub = onSnapshot(doc(db, `users/${user.uid}`), (user) => {
			if (user.exists()) {
				const onboardedList = user.data().onboarded
				if (onboardedList) {
					setOnboarded(onboardedList)
				}
			}
		})
		return unsub
	}, [])

	if (!classroom || !onboarded) {
		return (
			<Layout>
				<Grid item xs={12}>
					<Loading>Loading classroom data...</Loading>
				</Grid>
			</Layout>
		)
	}

	if (!player) {
		return (
			<Layout>
				<Grid item xs={12}>
					<Loading>Loading player data...</Loading>
				</Grid>
			</Layout>
		)
	}

	if (!onboarded.includes(classroom.id)) {
		return <OnboardingPage classroom={classroom} user={user} player={player} />
	}

	if (player.role === 'teacher') {
		return <TeacherView player={player} classroom={classroom} user={user} />
	} else if (player.role === 'student') {
		return <StudentView player={player} classroom={classroom} user={user} />
	} else {
		return <p>Error: Player role does not exist or is invalid.</p>
	}
}
