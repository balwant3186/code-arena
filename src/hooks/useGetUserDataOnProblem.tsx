import { auth, firestore } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const useGetUserDataOnProblem = (problemId: string) => {
  const [data, setData] = useState({
    liked: false,
    dislike: false,
    starred: false,
    solved: false,
  });

  const [user] = useAuthState(auth);

  useEffect(() => {
    const getUsersDataOnProblem = async () => {
      const userRef = doc(firestore, "users", user!.uid);

      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const {
          solvedProblems,
          likedProblems,
          dislikedProblems,
          starredProblems,
        } = userSnap.data();

        setData({
          liked: likedProblems.includes(problemId),
          dislike: dislikedProblems.includes(problemId),
          starred: starredProblems.includes(problemId),
          solved: solvedProblems.includes(problemId),
        });
      }
    };

    if (user) getUsersDataOnProblem();

    return () => {
      setData({
        liked: false,
        dislike: false,
        starred: false,
        solved: false,
      });
    };
  }, [user, problemId]);

  return {
    ...data,
    setData,
  };
};

export default useGetUserDataOnProblem;
