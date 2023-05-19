import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { Classroom, ForumPost, Player } from '../../types'

// Firestore mutations for forum functionality

export async function addForumPost(
	thread: {
		title: string
		postType: 0 | 1 | 2 | 3
		content: string
		author: Player
		anonymous: boolean
	},
	classroom: Classroom,
) {
	const classRef = collection(db, `classrooms/${classroom.id}/forumPosts`)
	await addDoc(classRef, {
		title: thread.title,
		postType: thread.postType,
		content: thread.content,
		author: thread.author.id,
		postTime: serverTimestamp(),
		anonymous: thread.anonymous,
		likers: [],
		pinnedComments: [],
	})
}

// Mutation to update Forum Post
export async function updateForumPost(
	updatedPost: {
		title: string
		content: string
		postType: number
	},
	classroomID: string,
	postID: string,
) {
	const postRef = doc(db, `classrooms/${classroomID}/forumPosts/${postID}`)
	await updateDoc(postRef, {
		title: updatedPost.title,
		content: updatedPost.content,
		postType: updatedPost.postType,
	})
}

// Mutation to delete forum posts
export async function deleteForumPost(classroomID: string, postID: string) {
	await deleteDoc(doc(db, `classrooms/${classroomID}/forumPosts/${postID}`))
}

export async function updateForumPostLikes(
	classroomID: string,
	postID: string,
	likerID: string,
	add: boolean,
) {
	const postRef = doc(db, `classrooms/${classroomID}/forumPosts/${postID}`)
	if (add) {
		await updateDoc(postRef, {
			likers: arrayUnion(likerID),
		})
	} else {
		await updateDoc(postRef, {
			likers: arrayRemove(likerID),
		})
	}
}

export async function addComment(
	comment: {
		content: string
		author: Player
	},
	classroom: Classroom,
	forumPost: ForumPost,
) {
	const commentRef = collection(
		db,
		`classrooms/${classroom.id}/forumPosts/${forumPost.id}/comments`,
	)
	await addDoc(commentRef, {
		author: comment.author.id,
		content: comment.content,
		postTime: serverTimestamp(),
		likers: [],
	})
}

// Mutation to delete forum comments
export async function deleteForumComment(classroomID: string, postID: string, commentID: string) {
	await deleteDoc(doc(db, `classrooms/${classroomID}/forumPosts/${postID}/comments/${commentID}`))
}

export async function updateForumCommentLikes(
	classroomID: string,
	postID: string,
	commentID: string,
	likerID: string,
	add: boolean,
) {
	const postRef = doc(db, `classrooms/${classroomID}/forumPosts/${postID}/comments/${commentID}`)
	if (add) {
		await updateDoc(postRef, {
			likers: arrayUnion(likerID),
		})
	} else {
		await updateDoc(postRef, {
			likers: arrayRemove(likerID),
		})
	}
}

export async function updateForumPostPinned(
	classroomID: string,
	postID: string,
	commentID: string,
	add: boolean,
) {
	const postRef = doc(db, `classrooms/${classroomID}/forumPosts/${postID}`)
	if (add) {
		await updateDoc(postRef, {
			pinnedComments: arrayUnion(commentID),
		})
	} else {
		await updateDoc(postRef, {
			pinnedComments: arrayRemove(commentID),
		})
	}
}
