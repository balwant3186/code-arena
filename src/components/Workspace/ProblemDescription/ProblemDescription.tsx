import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import { auth, firestore } from "@/firebase/firebase";
import useGetCurrentProblem from "@/hooks/useGetCurrentProblem";
import useGetUserDataOnProblem from "@/hooks/useGetUserDataOnProblem";
import { Problem } from "@/utils/types/problem";
import {
  arrayRemove,
  arrayUnion,
  doc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AiFillLike,
  AiFillDislike,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { toast } from "react-toastify";

type ProblemDescriptionProps = {
  problem: Problem;
  _solved: boolean;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problem,
  _solved,
}) => {
  const {
    currentProblem,
    setCurrentProblem,
    loading,
    problemDifficultyClasses,
  } = useGetCurrentProblem(problem.id);

  const { liked, disliked, solved, starred, setData } = useGetUserDataOnProblem(
    problem.id
  );

  const [updating, setUpdating] = useState(false);

  const [user] = useAuthState(auth);

  const returnUserDataAndProblemData = async (transaction: any) => {
    const userRef = doc(firestore, "users", user!.uid);
    const problemRef = doc(firestore, "problems", problem.id);

    const userDoc = await transaction.get(userRef);
    const problemDoc = await transaction.get(problemRef);

    return { userRef, userDoc, problemRef, problemDoc };
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like a problem.", {
        position: "top-center",
        theme: "dark",
      });
      return;
    }
    if (updating) return;

    setUpdating(true);

    await runTransaction(firestore, async (transaction) => {
      const { userRef, userDoc, problemRef, problemDoc } =
        await returnUserDataAndProblemData(transaction);

      if (userDoc.exists() && problemDoc.exists()) {
        if (liked) {
          transaction.update(userRef, {
            likedProblems: userDoc
              .data()
              .likedProblems.filter((id: string) => id !== problem.id),
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes - 1,
          });

          setCurrentProblem((prev) =>
            prev ? { ...prev, likes: prev.likes - 1 } : null
          );
          setData((prev) => ({ ...prev, liked: false }));
        } else if (disliked) {
          // push current problem user data in liked array and removing disliked problems from user data
          transaction.update(userRef, {
            likedProblems: [...userDoc.data().likedProblems, problem.id],
            dislikedProblems: userDoc
              .data()
              .dislikedProblems.filter((id: string) => id !== problem.id),
          });

          // increase problem likes count and decrease problem disliked count
          transaction.update(problemRef, {
            likes: problemDoc.data().likes + 1,
            dislikes: problemDoc.data().dislikes - 1,
          });
          setCurrentProblem((prev) =>
            prev
              ? {
                  ...prev,
                  likes: prev.likes + 1,
                  dislikes: prev.dislikes - 1,
                }
              : null
          );
          setData((prev) => ({ ...prev, liked: true, disliked: false }));
        } else {
          transaction.update(userRef, {
            likedProblems: [...userDoc.data().likedProblems, problem.id],
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes + 1,
          });

          setCurrentProblem((prev) =>
            prev ? { ...prev, likes: prev.likes + 1 } : null
          );
          setData((prev) => ({ ...prev, liked: true }));
        }
      }
    });

    setUpdating(false);
  };

  const handleDislike = async () => {
    if (!user) {
      toast.error("You must be logged in to dislike a problem.", {
        position: "top-center",
        theme: "dark",
      });
      return;
    }
    if (updating) return;

    setUpdating(true);

    await runTransaction(firestore, async (transaction) => {
      const { userRef, userDoc, problemRef, problemDoc } =
        await returnUserDataAndProblemData(transaction);

      if (userDoc.exists() && problemDoc.exists()) {
        if (disliked) {
          transaction.update(userRef, {
            dislikedProblems: userDoc
              .data()
              .dislikedProblems.filter((id: string) => id !== problem.id),
          });
          transaction.update(problemRef, {
            dislikes: problemDoc.data().dislikes - 1,
          });

          setCurrentProblem((prev) =>
            prev ? { ...prev, dislikes: prev.dislikes - 1 } : null
          );
          setData((prev) => ({ ...prev, disliked: false }));
        } else if (liked) {
          transaction.update(userRef, {
            likedProblems: userDoc
              .data()
              .likedProblems.filter((id: string) => id !== problem.id),
            dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes - 1,
            dislikes: problemDoc.data().dislikes + 1,
          });

          setCurrentProblem((prev) =>
            prev
              ? { ...prev, likes: prev.likes - 1, dislikes: prev.dislikes + 1 }
              : null
          );
          setData((prev) => ({ ...prev, liked: false, disliked: true }));
        } else {
          transaction.update(userRef, {
            dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
          });
          transaction.update(problemRef, {
            dislikes: problemDoc.data().dislikes + 1,
          });
          setCurrentProblem((prev) =>
            prev ? { ...prev, dislikes: prev.dislikes + 1 } : null
          );
          setData((prev) => ({ ...prev, disliked: true }));
        }
      }
    });

    setUpdating(false);
  };

  const handleStarred = async () => {
    if (!user) {
      toast.error("You must be logged in to starred a problem.", {
        position: "top-center",
        theme: "dark",
      });
      return;
    }
    if (updating) return;

    setUpdating(true);

    const userRef = doc(firestore, "users", user.uid);

    if (starred) {
      await updateDoc(userRef, {
        starredProblems: arrayRemove(problem.id),
      });
      setData((prev) => ({ ...prev, starred: false }));
    } else {
      await updateDoc(userRef, {
        starredProblems: arrayUnion(problem.id),
      });
      setData((prev) => ({ ...prev, starred: true }));
    }

    setUpdating(false);
  };

  return (
    <div className="bg-dark-layer-1">
      {/* TAB */}
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        <div
          className={
            "bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
          }
        >
          Description
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">
                {problem.title}
              </div>
            </div>

            {!loading && currentProblem && (
              <div className="flex items-center mt-3">
                <div
                  className={`${problemDifficultyClasses} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                >
                  {currentProblem.difficulty}
                </div>
                {(solved || _solved) && (
                  <div className="rounded p-[3px] ml-3 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                    <BsCheck2Circle />
                  </div>
                )}
                <div
                  className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px] ml-3 text-lg transition-colors duration-200 text-dark-gray-6"
                  onClick={handleLike}
                >
                  {liked && !updating && (
                    <AiFillLike className="text-dark-blue-s" />
                  )}
                  {!liked && !updating && <AiFillLike />}

                  {updating && (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  )}
                  <span className="text-xs">{currentProblem.likes}</span>
                </div>
                <div
                  className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px] ml-3 text-lg transition-colors duration-200 text-green-s text-dark-gray-6"
                  onClick={handleDislike}
                >
                  {disliked && !updating && (
                    <AiFillDislike className="text-dark-blue-s" />
                  )}
                  {!disliked && !updating && <AiFillDislike />}

                  {updating && (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  )}
                  <span className="text-xs">{currentProblem.dislikes}</span>
                </div>
                <div
                  className="cursor-pointer hover:bg-dark-fill-3 rounded p-[3px] ml-3 text-xl transition-colors duration-200 text-green-s text-dark-gray-6"
                  onClick={handleStarred}
                >
                  {starred && !updating && (
                    <TiStarOutline className="text-dark-yellow" />
                  )}

                  {!starred && !updating && <TiStarOutline />}

                  {updating && (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  )}
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-3 flex space-x-2">
                <RectangleSkeleton />
                <CircleSkeleton />
                <RectangleSkeleton />
                <RectangleSkeleton />
                <CircleSkeleton />
              </div>
            )}

            {/* Problem Statement(paragraphs) */}
            <div className="text-white text-sm">
              <div
                dangerouslySetInnerHTML={{
                  __html: problem.problemStatement,
                }}
              />
            </div>

            {/* Examples */}
            <div className="mt-4">
              {problem?.examples.map((example, index) => (
                <div key={example.id}>
                  <p className="font-medium text-white ">
                    Example {index + 1}:{" "}
                  </p>
                  {example.img && (
                    <Image
                      src={example.img}
                      alt={problem.title}
                      width={300}
                      height={300}
                      className="w-full mt-3"
                    />
                  )}
                  <div className="example-card">
                    <pre>
                      <strong className="text-white">Input: </strong>
                      {example.inputText} <br />
                      <strong>Output:</strong> {example.outputText} <br />
                      {example.explanation && (
                        <>
                          <strong>Explanation: </strong>
                          {example.explanation}
                        </>
                      )}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="my-5 pb-10">
              <div className="text-white text-sm font-medium">Constraints:</div>
              <ul className="text-white ml-5 list-disc">
                <div
                  dangerouslySetInnerHTML={{
                    __html: problem.constraints,
                  }}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProblemDescription;
