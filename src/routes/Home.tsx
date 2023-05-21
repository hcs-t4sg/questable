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
import Loading from '../components/global/Loading'

import wood1 from '/src/assets/Wood1.png'

// Route displaying the user's classrooms with options to create/join new classrooms

export default function Home({ user }: { user: User }) {
	// Listen for user's joined classrooms
	const [classrooms, setClassrooms] = useState<Classroom[] | null>(null)
	useEffect(() => {
		const q = query(collection(db, 'classrooms'), where('playerList', 'array-contains', user.uid))

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

	// Listen for user's pinned classroom settings
	const [pinned, setPinned] = useState<string[] | null>(null)
	useEffect(() => {
		const unsub = onSnapshot(doc(db, `users/${user.uid}`), (user) => {
			if (user.exists()) {
				const pinnedList = user.data().pinned
				if (pinnedList) {
					setPinned(pinnedList)
				} else {
					setPinned([])
				}
			}
		})
		return unsub
	}, [])

	// Sort user's classrooms by pinned status and role
	const pinnedClassrooms: Classroom[] = []
	const studentClassrooms: Classroom[] = []
	const teacherClassrooms: Classroom[] = []
	if (classrooms && pinned) {
		classrooms.forEach((classroom: Classroom) => {
			if (pinned.includes(classroom.id)) {
				pinnedClassrooms.push(classroom)
			} else if (classroom.teacherList.includes(user.uid)) {
				teacherClassrooms.push(classroom)
			} else {
				studentClassrooms.push(classroom)
			}
		})
	}

	const welcomeBox = (
		<Box
			sx={{
				height: '100%',
				width: '100%',
				backgroundImage: `url(${wood1})`,
				backgroundSize: 'cover',
				imageRendering: 'pixelated',
			}}
		>
			<Box
				sx={{
					width: '100%',
					height: 'fit-content',
					border: '10px solid',
					borderColor: 'primary.main',
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'center',
					textAlign: 'center',
					boxShadow: 2,
				}}
			>
				<Typography variant='h2' sx={{ mt: 4, mb: 10, flex: '100%', fontFamily: 'Superscript' }}>
					Welcome to Questable!
				</Typography>
				<Grid spacing={1} container columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent='center'>
					<Grid item>
						<JoinClassroomModal user={user} />
					</Grid>
					<Grid sx={{ mb: 4 }} item>
						<CreateClassroomModal user={user} />
					</Grid>
				</Grid>
			</Box>
		</Box>
	)

	if (!(classrooms && pinned))
		return (
			<Layout>
				<Grid item xs={12}>
					{welcomeBox}
				</Grid>
				<Grid item xs={12}>
					<Loading>
						{!classrooms ? 'Loading classrooms...' : 'Loading pinned classrooms...'}
					</Loading>
				</Grid>
			</Layout>
		)

	return (
		<Layout>
			<Grid item xs={12}>
				{welcomeBox}
			</Grid>
			<Grid item xs={12}>
				<Typography variant='h4' sx={{ flex: '100%', fontWeight: 'normal' }}>
					Pinned Classrooms
				</Typography>
			</Grid>
			{pinnedClassrooms.map((classroom) => (
				<Grid item xs={12} sm={6} md={4} key={classroom.id}>
					<ClassroomCard classroom={classroom} pinned={true} user={user} />
				</Grid>
			))}
			<Grid item xs={12}>
				<Typography variant='h4' sx={{ flex: '100%', fontWeight: 'normal' }}>
					Joined Classrooms
				</Typography>
			</Grid>
			{studentClassrooms.map((classroom) => (
				<Grid item xs={12} sm={6} md={4} key={classroom.id}>
					<ClassroomCard classroom={classroom} pinned={false} user={user} />
				</Grid>
			))}
			<Grid item xs={12}>
				<Typography variant='h4' sx={{ flex: '100%', fontWeight: 'normal' }}>
					Created Classrooms
				</Typography>
			</Grid>
			{teacherClassrooms.map((classroom) => (
				<Grid item xs={12} sm={6} md={4} key={classroom.id}>
					<ClassroomCard classroom={classroom} pinned={false} user={user} />
				</Grid>
			))}
		</Layout>
	)
}
