import React, { useState } from "react";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Split from "react-split";
import Playground from "./Playground/Playground";
import { Problem } from "@/utils/types/problem";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";

type WorkspaceProps = {
  problem: Problem;
};

const Workspace: React.FC<WorkspaceProps> = ({ problem }) => {
  const { width, height } = useWindowSize();

  const [success, setSuccess] = useState(false);

  return (
    <Split className="split" minSize={0}>
      <ProblemDescription problem={problem} />
      <div>
        <Playground problem={problem} />
        {success && (
          <Confetti
            gravity={0.1}
            tweenDuration={4000}
            width={width - 10}
            height={height - 10}
          />
        )}
      </div>
    </Split>
  );
};
export default Workspace;
