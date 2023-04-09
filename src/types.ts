import { Timestamp } from 'firebase/firestore'

export interface Assignment {
	id: string
	name: string
	description: string
	reward: number
	created: Timestamp
	assigned: string[]
}

export interface Task extends Assignment {
	completed: string[]
	confirmed: string[]
	due: Timestamp
}

export interface TaskWithStatus extends Task {
	status: 0 | 1 | 2 | 3
}

export interface TaskCompletionTime {
	id: string
	time: Timestamp
}

export interface TaskWithCompletionTimes extends Task {
	completionTimes: TaskCompletionTime[]
}

export interface CompletedTask extends Task {
	player: Player
	completionTime: Timestamp
}

export interface Repeatable extends Assignment {
	maxCompletions: number
	requestCount: number
}

export interface RepeatablePlayerCompletionsArray {
	id: string
	completions: number
}

export interface RepeatableWithPlayerCompletionsArray extends Repeatable {
	playerCompletions: RepeatablePlayerCompletionsArray[]
}

export interface RepeatableWithPlayerData extends Repeatable {
	completions: number
	confirmations: number
}

export interface CompletionTime {
	id: string
	playerID: string
	time: Timestamp
}

export interface RepeatableCompletion {
	id: string
	repeatable: Repeatable
	player: Player
	time: Timestamp
}

export interface Classroom {
	id: string
	name: string
	playerList: string[]
	teacherList: string[]
	canEdit: boolean
}

export interface Player {
	id: string
	name: string
	role: UserRole
	money: number
	avaBody?: number
	avaHair?: number
	avaShirt?: number
	avaPants?: number
	avaShoes?: number
	avaAccessories?: number
	avaHairSubtype?: string
}

export interface DatabaseInventoryItem {
	itemId: number
	type: 'body' | 'hair' | 'shirt' | 'pants' | 'shoes'
	subtype?: string
}

export interface Item {
	id: number
	name: string
	description: string
	type: 'body' | 'hair' | 'shirt' | 'pants' | 'shoes'
	subtype?: string
	price: number
	renderStatic: () => JSX.Element
	renderAnimated: () => JSX.Element
}

export interface Outfit {
	body: Item
	hair: Item
	shirt: Item
	pants: Item
	shoes: Item
}

export type UserRole = 'student' | 'teacher'

export interface PlayerWithEmail extends Player {
	email: string
}

export interface ForumPost {
	id: string
	title: string
	content: string
	postTime: Timestamp
	likes: number
	author: Player
	postType: 0 | 1 | 2 | 3
	anonymous: 0 | 1
	likers: Array<string>
	pinnedComments: Array<string>
}

export interface Comment {
	id: string
	content: string
	author: string
	likes: number
	postTime: Timestamp
	likers: Array<string>
}
