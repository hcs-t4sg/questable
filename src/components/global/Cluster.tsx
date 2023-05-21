import { Typography } from '@mui/material'
import { DOMPurify } from '../student/AssignmentContentStudent'

// Data display format used in several modals across app

export const Cluster = ({
	title,
	data,
	isHtml,
}: {
	title: string
	data: string | number | JSX.Element
	isHtml: boolean
}) => (
	<>
		<Typography sx={{ marginTop: '25px' }} fontWeight='bold' variant='h6'>
			{title}
		</Typography>
		{isHtml && typeof data == 'string' ? (
			<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data) }} />
		) : (
			<Typography fontWeight='light' variant='body1'>
				{data}
			</Typography>
		)}
	</>
)
