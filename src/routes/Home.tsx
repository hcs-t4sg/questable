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

export default function Home({ user }: { user: User }) {
	// Listen to user's classrooms and maintain a corresponding state variable
	const [classrooms, setClassrooms] = useState<Classroom[] | null>(null)
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

	// Construct the pinned, student, and teacher classroom arrays based on the "classrooms" and "pinned" state variables
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

	if (!(classrooms && pinned))
		return (
			<Layout>
				<Grid container spacing={3}>
					<Grid item xs={12}>
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
									height: 300,
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
								<Typography variant='h3' sx={{ flex: '100%' }}>
									Welcome Back, {user.displayName}!
								</Typography>
								<Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent='center'>
									<Grid item>
										<JoinClassroomModal user={user} />
									</Grid>
									<Grid item>
										<CreateClassroomModal user={user} />
									</Grid>
								</Grid>
							</Box>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Loading>
							{!classrooms ? 'Loading classrooms...' : 'Loading pinned classrooms...'}
						</Loading>
					</Grid>
				</Grid>
			</Layout>
		)

	const classroomsSection =
		classrooms && pinned ? (
			<>
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
			</>
		) : (
			<Grid item xs={12}>
				<Loading>Loading classrooms...</Loading>
			</Grid>
		)

	return (
		<Layout>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Box
						sx={{
							height: '100%',
							width: '100%',
							backgroundImage: `url(${wood1})`,
							backgroundSize: 'cover',
						}}
					>
						<Box
							sx={{
								width: '100%',
								height: 300,
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
							<Typography variant='h3' sx={{ flex: '100%' }}>
								Welcome Back, {user.displayName}!
							</Typography>
							<Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent='center'>
								<Grid item>
									<JoinClassroomModal user={user} />
								</Grid>
								<Grid item>
									<CreateClassroomModal user={user} />
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Grid>
				{classroomsSection}
			</Grid>
		</Layout>
	)
}
