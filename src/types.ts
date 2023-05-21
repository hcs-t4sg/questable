import { Timestamp } from 'firebase/firestore'
export interface Assignment {
	id: string // Firestore ID of the assignment doc
	name: string // Name of assignment
	description: string // ! Description of assignment. With React Quill, this is stringified HTML and should be sanitized with DOMPurify before being used!
	reward: number // Monetary reward for confirmed assignment completion in in-game gold
	created: Timestamp // When the assignment was created by teacher
	assigned: string[] // Array of player IDs for players to whom the assignment has been given
}

// TODO: A new interface GCRTask that extends Task with the relevant GCR-specific properties should be created. This interface should then be used to eliminate the usage of the 'any' type in GCR-related files like CreateGCRTask
export interface Task extends Assignment {
	completed: string[] // Array of player IDs containing players who have completed the task and are pending confirmation
	confirmed: string[] // Array of player IDs containing players whos completion of the task has been confirmed by the teacher
	due: Timestamp // Due date of task
	gcrCourseID?: string // ID of Google Classroom Course containing the corresponding GCR assignment
	gcrID?: string // ID of corresponding GCR assignment
	gcrName?: string // Name of corresponding GCR assignment
}

export interface TaskWithStatus extends Task {
	status: 0 | 1 | 2 | 3 // Status of task (assigned, completed, confirmed, overdue)
}

export interface CompletedTask extends Task {
	player: Player // Player who completed task
	completionTime: Timestamp // Timestamp of the completion
}

export interface Repeatable extends Assignment {
	maxCompletions: number // Maximum allowed completions of the repeatable. The total queued completions + total confirmations cannot exceed this amount
	requestCount: number // Number of confirmation requests for this particular repeatable. Updating this field is important for proper display of repeatable requests in the teacher view
}

export interface RepeatableWithPlayerData extends Repeatable {
	completions: number // Number of queued completions the player has for the given repeatable
	confirmations: number // Number of confirmations the player has for the given repeatable
}

export interface CompletionTime {
	id: string // Firestore ID of the completion time doc
	playerID: string // ID of player who submitted the repeatable completion
	time: Timestamp // Time at which completion was submitted
}

// Aggregate type containing "full" information for a completed repeatable
export interface RepeatableCompletion {
	id: string // Firestore ID of corresponding completion time doc
	repeatable: Repeatable // Repeatable for which completion has been submitted
	player: Player // Player who submitted the repeatable completion
	time: Timestamp // Time at which completion was submitted
}

export interface Classroom {
	id: string // Firestore ID of corresponding classroom doc
	name: string // Classroom name
	playerList: string[] // User/player IDs for students in the classroom
	teacherList: string[] // User IDs for teachers in the classroom
	doLeaderboard: boolean // If the class leaderboard should be displayed to students
	leaderboardSize: number // Number of students to display on the class leaderboard (on student end)
	doForumPostEditing: boolean // If students are allowed to edit/delete their own forum posts
}

export interface Player {
	id: string // Firestore ID of corresponding player doc
	name: string // Player name
	role: UserRole // Player role
	money: number // Player's balance in ingame money
	avaBody?: number // Item ID of player's avatar body
	avaHair?: number // Item ID of player's avatar hair
	avaShirt?: number // Item ID of player's avatar shirt
	avaPants?: number // Item ID of player's avatar pants
	avaShoes?: number // Item ID of player's avatar shoes
	avaEyes?: number // Item ID of player's avatar eyes
	avaHairSubtype?: string // Subtype of player's hair subtype
	xp: number // Player's ingame experience points. Whenever the player gains money ingame, they gain an equivalent value in experience points. Used to calculate player's level
}

export interface DatabaseInventoryItem {
	itemId: number // ID of item, as stored in the db (same as Item id below)
	type: 'body' | 'hair' | 'shirt' | 'pants' | 'shoes' | 'eyes' // Type of item, as stored in the db (same as Item type below)
	subtype?: string // Subtype of item if required (only for hair at the moment). Same as Item subtype below
}

export interface Item {
	id: number // ID of item, as established in items.tsx. Reflects the location in the spritesheet that needs to be traversed to render the item sprite
	name: string // Name of item
	description: string // Description of item
	type: 'body' | 'hair' | 'shirt' | 'pants' | 'shoes' | 'eyes' // Type of item as established in items.tsx. Reflects which spritesheet file needs to be accessed to render the item sprite
	subtype?: string // Subtype of item if required (only for hair at the moment)
	price: number // Price of item in in-game shop
	renderStatic: () => JSX.Element // Method that renders a static version of the item sprite
	renderAnimated: () => JSX.Element // Method that renders an animated version of the item sprite
}

// Aggregate type specifying a player's avatar appearance. The constituent items are rendered on top of each other to display the avatar in Avatar.tsx
export interface Outfit {
	body: Item
	hair: Item
	shirt: Item
	pants: Item
	shoes: Item
	eyes: Item
}

export type UserRole = 'student' | 'teacher'

export interface PlayerWithEmail extends Player {
	email: string // Email of the user corresponding to the given player
}

export interface ForumPost {
	id: string // Firestore ID of corresponding forum post document
	title: string // Title of post
	content: string // ! Content of post. With React Quill, this is stringified HTML and should be sanitized with DOMPurify before being used!
	postTime: Timestamp // Post time
	author: Player // Player who authored the forum post
	postType: 0 | 1 | 2 | 3 // Category of forum post: Labels of categories are specified in EditForumPostModal
	anonymous: boolean // If the post is anonymous (author is hidden)
	likers: Array<string> // List of player IDs of players who have liked the forum post
	pinnedComments: Array<string> // List of comment IDs of post comments that have been pinned by teacher/author
}

export interface Comment {
	id: string // Firestore ID of corresponding comment
	content: string // Content of comment. At the moment this is just text
	author: string // Author of comment
	postTime: Timestamp // Post time of comment
	likers: string[] // List of player IDs of players who have liked the comment
}

export interface CustomShopItems {
	id: string // Firestore ID of the custom shop item
	name: string // Name of custom shop item
	description: string // Description of custom shop item
	price: number // Price of custom shop item (in ingame gold)
	isActive: boolean // If the shop item is being displayed to students
}

export interface PurchasedReward {
	id: string // Firestore ID of the request document
	rewardName: string // Name of reward at time of purchase
	rewardDescription: string // Description of reward at time of purchase
	rewardPrice: number // Price of reward at time of purchase
	playerID: string // ID of purchasing player
	playerName: string // Name of purchasing player
}
