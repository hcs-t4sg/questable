import { Timestamp } from 'firebase/firestore'

interface Assignment {
	id: string
	name: string
	description: string
	reward: number
	created: number
	assigned: string[]
}

export interface Task extends Assignment {
	completed: string[]
	confirmed: string[]
	due: number
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
}

export interface RepeatablePlayerCompletionsArray {
	id: string
	completions: number
}

export interface RepeatableWithPlayerCompletionsArray extends Repeatable {
	playerCompletions: RepeatablePlayerCompletionsArray[]
}

export interface RepeatableWithCompletionCount extends Repeatable {
	completions: number
}

// export interface RepeatableCompletion

export interface Classroom {
	id: string
	name: string
	playerList: string[]
	teacherList: string[]
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
