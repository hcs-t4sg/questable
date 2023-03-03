import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { User } from 'firebase/auth'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import ClassroomCard from '../components/global/ClassroomCard'
import CreateClassroomModal from '../components/global/CreateClassroomModal'
import JoinClassroomModal from '../components/global/JoinClassroomModal'
import Layout from '../components/global/Layout'
import { Classroom } from '../types'
import { db } from '../utils/firebase'

export default function Home({ user }: { user: User }) {
	// Listen to user's classrooms and maintain a corresponding state variable
	const [classrooms, setClassrooms] = useState<Classroom[]>([])
	useEffect(() => {
		const q = query(collection(db, 'classrooms'), where('playerList', 'array-contains', user.uid))
		console.log(q)

		const unsub = onSnapshot(q, (snapshot) => {
			const classroomsList = snapshot.docs.map(
				(doc): Classroom =>
					({
						...doc.data(),
						id: doc.id,
					} as Classroom),
			)
			setClassrooms(classroomsList)
		})
		return unsub
	}, [])

	// Listen to user's pinned list and maintain a corresponding state variable
	const [pinned, setPinned] = useState<string[]>([])
	useEffect(() => {
		const unsub = onSnapshot(doc(db, `users/${user.uid}`), (user) => {
			if (user.exists()) {
				const pinnedList = user.data().pinned
				if (pinnedList) {
					setPinned(pinnedList)
				}
			}
		})
		return unsub
	}, [])

	// Construct the pinned, student, and teacher classroom arrays based on the "classrooms" and "pinned" state variables
	const pinnedClassrooms: Classroom[] = []
	const studentClassrooms: Classroom[] = []
	const teacherClassrooms: Classroom[] = []
	classrooms.forEach((classroom: Classroom) => {
		if (pinned.includes(classroom.id)) {
			pinnedClassrooms.push(classroom)
		} else if (classroom.teacherList.includes(user.uid)) {
			teacherClassrooms.push(classroom)
		} else {
			studentClassrooms.push(classroom)
		}
	})

	return (
		<Layout>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Box
						sx={{
							width: '100%',
							height: 300,
							backgroundColor: 'primary.dark',
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
						}}
					>
						<Typography variant='h3' sx={{ flex: '100%' }}>
							Welcome Back!
						</Typography>
						<JoinClassroomModal user={user} />
						<CreateClassroomModal user={user} />
					</Box>
				</Grid>
				<Grid item xs={12}>
					<Typography variant='h5' sx={{ flex: '100%' }}>
						Pinned Classrooms
					</Typography>
				</Grid>
				{pinnedClassrooms.map((classroom) => (
					<Grid item xs={12} sm={6} md={4} key={classroom.id}>
						<ClassroomCard classroom={classroom} pinned={true} user={user} />
					</Grid>
				))}
				<Grid item xs={12}>
					<Typography variant='h5' sx={{ flex: '100%' }}>
						Joined Classrooms
					</Typography>
				</Grid>
				{studentClassrooms.map((classroom) => (
					<Grid item xs={12} sm={6} md={4} key={classroom.id}>
						<ClassroomCard classroom={classroom} pinned={false} user={user} />
					</Grid>
				))}
				<Grid item xs={12}>
					<Typography variant='h5' sx={{ flex: '100%' }}>
						Created Classrooms
					</Typography>
				</Grid>
				{teacherClassrooms.map((classroom) => (
					<Grid item xs={12} sm={6} md={4} key={classroom.id}>
						<ClassroomCard classroom={classroom} pinned={false} user={user} />
					</Grid>
				))}
			</Grid>
		</Layout>
	)
}
