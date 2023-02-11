import { getAuth, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import StudentView from "../components/StudentView";
import TeacherView from "../components/TeacherView";
import { db } from "../utils/firebase";
import { getPlayerData, syncUsers } from "../utils/mutations";
import { Player, Classroom } from "../types";
import { useState, useEffect } from "react";

export default function ClassroomPage({ user }: { user: User }) {
  // Use react router to fetch class ID from URL params
  let params = useParams();
  const classID = params.classID;

  // Fetch user's player information for classroom
  const [player, setPlayer] = useState<Player | null>(null);
  useEffect(() => {
    const updatePlayer = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!!user && classID) {
        syncUsers(user);
        const playerData = await getPlayerData(classID, user.uid);
        if (playerData) setPlayer(playerData);
      }
    };
    updatePlayer().catch(console.error);
  }, [classID]);

  // Listen to classroom data
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  useEffect(() => {
    // If you don't check for classID you get a 'No overload matches this call' error. Function overloading in Typescript is when there are multiple functions with the same name but different parameter types and return type. Without checking for the existence of classID, the type is string | undefined. Firebase does not have an overload for the doc() function that includes a possible classID (document id) input that is string | undefined.
    if (classID) {
      const classroomRef = doc(db, "classrooms", classID);

      onSnapshot(classroomRef, (doc) => {
        if (doc.exists()) {
          setClassroom({ ...doc.data(), id: doc.id } as Classroom);
        }
      });
    }
  }, [user, classID]);
  if (classroom) {
    if (player?.role === "teacher") {
      return <TeacherView player={player} classroom={classroom} user={user} />;
    } else if (player?.role === "student") {
      return <StudentView player={player} classroom={classroom} user={user} />;
    } else {
      return <p>Error: Player role does not exist or is invalid.</p>;
    }
  } else {
    return <p>Error: Classroom does not exist.</p>;
  }
}
