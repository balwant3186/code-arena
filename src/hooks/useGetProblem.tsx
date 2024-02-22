import { firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

const useGetProblems = (
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [problems, setProblems] = useState<DBProblem[]>([]);

  useEffect(() => {
    const getProblems = async () => {
      try {
        const q = query(
          collection(firestore, "problems"),
          orderBy("order", "asc")
        );

        const querySnapshot = await getDocs(q);
        const tempProblemData: DBProblem[] = [];

        querySnapshot.forEach((doc) => {
          tempProblemData.push(doc.data() as DBProblem);
        });

        setProblems(tempProblemData);
        setLoadingProblems(false);
      } catch (error) {
        console.log(error);
      }
    };
    getProblems();
  }, [setLoadingProblems]);

  return problems;
};

export default useGetProblems;
