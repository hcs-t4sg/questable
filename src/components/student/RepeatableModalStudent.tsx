import { Box, Button } from '@mui/material'
import { Repeatable } from '../../types'
import blue3 from '/src/assets/spriteSheets/potions/blue3.png'
import green3 from '/src/assets/spriteSheets/potions/green3.png'
import purple3 from '/src/assets/spriteSheets/potions/purple3.png'
import red3 from '/src/assets/spriteSheets/potions/red3.png'
import { AssignmentContentStudent, Cluster } from './AssignmentContentStudent'

export function rewardPotion(rewardAmount: number) {
	const rewardMatch =
		rewardAmount === 10
			? blue3
			: rewardAmount === 20
			? green3
			: rewardAmount === 30
			? purple3
			: rewardAmount === 40
			? red3
			: ''

	return (
		<Box
			component='img'
			sx={{
				imageRendering: 'pixelated',
				maxHeight: { xs: 140, md: 200 },
				maxWidth: { xs: 140, md: 200 },
				minWidth: '28px',
				minHeight: '31.5px',
				position: 'relative',
			}}
			alt='Potion'
			src={rewardMatch}
			height='100%'
			width='100%'
		/>
	)
}

export default function RepeatableModalStudent({
	repeatable,
	open,
	toggleOpenCallback,
	handleCompleteCallback,
}: {
	repeatable: Repeatable
	open: boolean
	toggleOpenCallback: () => void
	handleCompleteCallback: () => void
}) {
	return (
		<AssignmentContentStudent
			assignment={repeatable}
			assignmentType='Repeatable'
			isOpen={open}
			toggleIsOpen={toggleOpenCallback}
		>
			<Cluster title='Task Name' data={repeatable.name} isHtml={false} />
			<Cluster title='Description' data={repeatable.description} isHtml={true} />
			<Cluster title='Reward Amount' data={`${repeatable.reward}g`} isHtml={false} />
			<Cluster title='Completions' data={repeatable.requestCount} isHtml={false} />
			<Cluster title='Max Completions' data={repeatable.maxCompletions} isHtml={false} />
			<Cluster
				title=''
				data={
					<Button onClick={handleCompleteCallback} variant='contained' color='success'>
						Mark as complete
					</Button>
				}
				isHtml={false}
			/>
		</AssignmentContentStudent>
	)
}
