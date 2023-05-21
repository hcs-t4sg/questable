import { Button } from '@mui/material'
import { Repeatable } from '../../types'
import { AssignmentContentStudent } from './AssignmentContentStudent'
import { Cluster } from '../global/Cluster'

// Modal displaying detailed information about a repeatable

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
