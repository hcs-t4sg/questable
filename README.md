# Questable

<p align="center">
  <img width="256" height="256" src="https://github.com/hcs-t4sg/questable/blob/cdf0bdccbd73f53326383c13c0bd876807d2d3f2/.github/logo.png">
</p>

Questable is an open-source, gamified learning management system (LMS) designed by Harvard Computer Society [Tech for Social Good](https://socialgood.hcs.harvard.edu) (T4SG). It integrates into the classroom workflow to provide an "RPG-style" learning experience that rewards students ingame for completing various classroom tasks (e.g. related to assignments, studying, or participation). Questable is targeted towards K-6 audiences and aims to provide educators with a valuable tool to motivate classroom participation and academic engagement.

---

## Overview of Functionality

You can watch a video walkthrough of Questable's functionality as of May 2023 [here](https://youtu.be/9pHFQeNmg2M). A live demo version of Questable can be found at [questable.vercel.app](https://questable.vercel.app).

### Logging in

Users can log into Questable using an email and password or their Google account. Please use an email you have access to.

### Classrooms, teachers, and students

On Questable's home page (accessible by clicking the logo in the top left), users can create new classrooms, join existing classrooms, and view all the classrooms they are currently in. They can also pin important classrooms to the top of the page.

Users are set as teachers in classrooms they create and students in clasrooms they join. Teachers can copy the join code for their created classroom and distribute it to students, who can then join the classroom by entering the code.

While on Questable's home page, clicking on the card for a classroom will open the page for that classroom.

### In-game avatars

Every member of a classroom (both teachers and students) has an in-game **character** unique to that classroom, represented by an avatar. Upon entering a classroom for the first time, the user will be prompted to enter their character's name and customize their **avatar**'s appearance.

### Tasks (One-time and repeatable)

On the **Tasks page**, teachers can create **tasks** in Questable that correspond to real-world classroom assignments (e.g. "Complete Monday's math homework", "Finish the essay on plants", "Bring signed permission slip", etc.). Tasks created in Questable are automatically assigned to all students in the classroom, even students that join after the task is created. As part of Questable's gamified experiences, tasks are represented to students as "**quests**" in the **Quests page** of the classroom.

Once a student completes the corresponding classroom assignment, they can **mark the task as complete** in their Quests page. This creates a **request** in the teacher's **Requests page** to verify the task's completion. Once the teacher verifies that the student completed the corresponding real-world assignment (e.g. checks to make sure the student wrote the essay), they can **confirm** the completion of the task, after which the student will be rewarded with a specified amount of in-game currency (**gold**). If the student marked the task as complete without actually completing the corresponding real-world assignment, the teacher can **deny** the completion of the task, and the task will be sent back to the student's Quests page for another try.

Teachers have the option to create **one-time** tasks or **repeatable** tasks. One-time tasks have a specified **due-date**, after which students will not be able to mark the task as complete. These are useful for traditional, **non-repeating classroom assignments** like homework assignments, essays, exams, projects, etc.

On the other hand, repeatable tasks are better suited for **regularly reoccurring items** (e.g. weekly quizzes) or for classroom habits a teacher wishes to incentivize (e.g. "ask a question in class" or "help a classmate on an activity"). Instead of a due date, repeatable tasks have a specified **maximum number of completions** per week. Students can complete and receive confirmation for a repeatable task multiple times up to the maximum allowed number every week. Completions for repeatable tasks "reset" **every Sunday at 11:59 PM**, and the teacher does not have to recreate the repeatable.

### Google Classroom integration

To make it easier for teachers to maintain their Questable classrooms, Questable offers an integration with existing Google Classrooms when teachers log into their Google account in the Settings page. When creating a one-time task, teachers can **import existing assignments from Google Classroom** to autofill the task details. One-time tasks created this way are now linked to the corresponding Google Classroom assignments. On the Requests page, teachers have the option to **mass-process** all one-time tasks linked to Google Classroom, which will confirm the task completion if the student has turned in the corresponding Google Classroom assignment.

### In-game shop and rewards

Students are rewarded with in-game currency ("**gold**") for completing tasks. Students can use their gold in the **Shop page** to purchase **items/accessories** to customize their in-game avatars. The teacher can also create and manage **custom rewards** to be displayed to students in the Shop (purchasable with gold). Teachers should set the description of these rewards to correspond to real-world classroom rewards (e.g. "lunch with the teacher", "homework pass", etc.). If a student purchases a custom reward, a record of that purchase will be added to the teacher's Requests page. The teacher should confirm the reward once given to the student in real life.

### Class page, character levels, and experience

The **Class page** shows an overview of all students in the classroom. The teacher's class page shows detailed statistics related to each student and allows the teacher to manually edit players' gold balances or character names, if needed. The students' class page shows the avatars, names, and emails of other students.

Additionally, the students' class page displays a **class leaderboard** based on the students' character level. Every time a student gains gold for completing a task, they earn the same amount of **experience points** (xp). The student's character's **level** is then calculated from a formula using their total amount of experience points. For privacy reasons, students can only see each other students' levels but not their total experience points, and the class leaderboard only displays the highest-level students in the class. In the classroom settings, the teacher can toggle whether the leaderboard is visible to students and adjust the number of students to display in the leaderboard.

### Class forum

Each classroom has a **forum** where students/teachers can make posts discussing classroom material. Posts are searchable and can be assigned to one of several preset **categories**. When creating a post, the student has the option to **post anonymously** (such as for asking an anonymous question). In classroom settings, the teacher can toggle whether students are allowed to retroactively edit or delete their forum posts.

Each forum post has a chatroom-style **comment section** where class participants can further discuss the post content. Finally, the teacher and author of the post have the option to **pin** helpful comments to the top of the post so that they are more visible.

### Other settings

Students and teachers can change their character name in the Settings page for each classroom.

---

## Installation and setup

Teachers/students wishing to test Questable's features can visit our live deployment at [questable.vercel.app](https://questable.vercel.app). Please note that Questable is still working towards a full "commercial-grade" deployment, so please do not store any sensitive data on the Questable website as it may be erased at some point.

If you are a developer and wishing to host your own deployment of Questable, you will need to set up a Firebase project for authentication/database and Google Cloud project for the Google Classroom API connection. The following environment variables should be configured (such as in an `.env.local` and in the environment variables of a hosting provider) to connect to Firebase and Google Cloud:

```
# Google Cloud keys (for Google login)

VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_CLIENT_SECRET=
VITE_GOOGLE_API_KEY=

# Firebase backend keys
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

---

## Acknowledgements

We would like to thank the following teams for all of their hard work building Questable as a project under Harvard Tech for Social Good:

- Hannah, Eileen, Matthew, Ron, Cole, Alex,
- Fall 2022: Alex, Cole, Eileen, Hannah, Matthew, and Ron
- Spring 2023: Ashley, Eileen, Evelyn, Itzel, Jayden, and Matthew

Additionally, we would like to thank the support of the T4SG board and community for their valuable support and guidance throughout the development of Questable.
