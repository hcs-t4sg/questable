import { useEffect, useState } from 'react'
import { Classroom, CustomShopItems } from '../../types'
import DeleteIcon from '@mui/icons-material/Delete'
import {
	Box,
	Card,
	CardContent,
	Grid,
	IconButton,
	Stack,
	Typography,
	useTheme,
} from '@mui/material'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import ShopTeacherModal from './ShopTeacherModal'
import { deleteItem } from '../../utils/mutations/shop'
import blue3 from '/src/assets/spriteSheets/potions/blue3.png'
import green3 from '/src/assets/spriteSheets/potions/green3.png'
import purple3 from '/src/assets/spriteSheets/potions/purple3.png'
import red3 from '/src/assets/spriteSheets/potions/red3.png'
import ShopeTeacherEditModal from './ShopTeacherEditModal'
import { enqueueSnackbar } from 'notistack'

export function iconPotion(priceAmount: number) {
	const iconMatch =
		priceAmount === 50
			? blue3
			: priceAmount === 100
			? green3
			: priceAmount === 150
			? purple3
			: priceAmount === 200
			? red3
			: ' '
	return (
		<Box
			component='img'
			sx={{
				imageRendering: 'pixelated',
				maxHeight: { xs: 140, md: 200 },
				maxWidth: { xs: 140, md: 200 },
				minWidth: '28px',
				minHeight: '28px',
				position: 'relative',
			}}
			alt='Potion'
			src={iconMatch}
			height='100%'
			width='80%'
		/>
	)
}

export default function ShopTeacher({ classroom }: { classroom: Classroom }) {
	const theme = useTheme()
	const [customShopItems, setCustomShopItems] = useState<CustomShopItems[] | null>(null)

	const handleDelete = (item: CustomShopItems) => {
		if (window.confirm('Are you sure you want to delete this task?')) {
			deleteItem(classroom.id, item.id)
				.then(() => {
					enqueueSnackbar('Deleted task!', { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar(err.message, { variant: 'error' })
				})
		}
	}
	useEffect(() => {
		const itemsRef = collection(db, `classrooms/${classroom.id}/customShopItems`)
		const itemsQuery = query(itemsRef)

		const unsub = onSnapshot(itemsQuery, (snapshot) => {
			setCustomShopItems(
				snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as CustomShopItems)),
			)
		})
		return unsub
	}, [classroom])

	return (
		<>
			<Grid item xs={12}>
				<Typography
					sx={{
						[theme.breakpoints.down('mobile')]: {
							fontSize: '18px',
						},
					}}
					variant='h4'
				>
					Create a New Reward
				</Typography>
				<ShopTeacherModal classroom={classroom}></ShopTeacherModal>
			</Grid>
			{customShopItems
				? customShopItems.map((customShopItem) => (
						<Card
							sx={{
								width: 0.22,
								[theme.breakpoints.down('mobile')]: {
									width: 0.4,
								},
								m: 2,
							}}
							key={customShopItem.id}
						>
							<CardContent>
								<Box marginLeft={3.3}> {iconPotion(customShopItem.price)}</Box>
								<Typography
									sx={{
										[theme.breakpoints.down('mobile')]: {
											fontSize: '10px',
										},
									}}
									variant='body1'
								>
									{' '}
									Name: {customShopItem.name}{' '}
								</Typography>
								<Typography
									sx={{
										[theme.breakpoints.down('mobile')]: {
											fontSize: '10px',
										},
									}}
									variant='body1'
								>
									{' '}
									Description: {customShopItem.description}{' '}
								</Typography>
								<Typography
									sx={{
										[theme.breakpoints.down('mobile')]: {
											fontSize: '10px',
										},
									}}
									variant='body1'
								>
									{' '}
									Price: {customShopItem.price}{' '}
								</Typography>
								<Stack spacing={2} direction='row-reverse'>
									<IconButton onClick={() => handleDelete(customShopItem)}>
										<DeleteIcon />
									</IconButton>
									<ShopeTeacherEditModal
										item={customShopItem}
										classroom={classroom}
									></ShopeTeacherEditModal>
								</Stack>
							</CardContent>
						</Card>
				  ))
				: null}
		</>
	)
}
