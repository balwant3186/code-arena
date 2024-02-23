import { firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const useGetCurrentProblem = (problemId: string) => {
  const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);

  const [loading, setLoading] = useState(true);
  const [problemDifficultyClasses, setProblemDifficultyClasses] = useState("");

  useEffect(() => {
    const getCurrentProblem = async () => {
      setLoading(true);
      const docRef = doc(firestore, "problems", problemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCurrentProblem({
          id: docSnap.id,
          ...docSnap.data(),
        } as DBProblem);

        setProblemDifficultyClasses(
          docSnap.data().difficulty === "Easy"
            ? "bg-olive text-olive"
            : docSnap.data().difficulty === "Medium"
            ? "bg-dark-yellow text-dark-yellow"
            : "bg-dark-pink text-dark-pink"
        );
      }
      setLoading(false);
    };

    getCurrentProblem();
  }, [problemId]);

  return {
    currentProblem,
    loading,
    problemDifficultyClasses,
    setCurrentProblem,
  };
};

export default useGetCurrentProblem;
