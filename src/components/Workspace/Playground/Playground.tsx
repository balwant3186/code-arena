import React, { useState } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import ReactCodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./EditorFooter/EditorFooter";
import { Problem } from "@/utils/types/problem";

type PlaygroundProps = {
  problem: Problem;
};

const Playground: React.FC<PlaygroundProps> = ({ problem }) => {
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState<number>(0);

  return (
    <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
      <PreferenceNav />

      <Split
        className="h-[calc(100vh-94px)]"
        direction="vertical"
        sizes={[60, 40]}
        minSize={60}
      >
        <div className="w-full overflow-auto">
          <ReactCodeMirror
            value={problem.starterCode}
            theme={vscodeDark}
            extensions={[javascript()]}
            style={{ fontSize: 16 }}
          />
        </div>

        <div className="w-full px-5 overflow-auto pt-2">
          {/* TestCase heading */}
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex h-full flex-col-justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-white">
                Testcases
              </div>
              <hr className="absolute bottom-3 h-0.5 w-full rounded-full border-none bg-white" />
            </div>
          </div>

          <div className="flex">
            {/* Cases */}
            {problem?.examples.map((problem, index) => (
              <div className="mr-2 items-start mt-2" key={problem.id}>
                <div
                  className="flex flex-wrap items-center gap-y-4"
                  onClick={() => setActiveTestCaseIdx(index)}
                >
                  <div
                    className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap ${
                      activeTestCaseIdx === index
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    Case {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="font-semibold my-4 pb-10">
            <p className="text-sm font-medium mt-4 text-white">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem?.examples[activeTestCaseIdx]?.inputText}
            </div>

            <p className="text-sm font-medium mt-4 text-white">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem?.examples[activeTestCaseIdx]?.outputText}
            </div>
          </div>
        </div>
      </Split>

      <EditorFooter />
    </div>
  );
};
export default Playground;
