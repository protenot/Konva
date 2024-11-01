import Konva from "konva";
import { useRef, useState } from "react";
import { ACTIONS } from "./constants/constants";
import Toolbar from "./components/toolbar/toolbar";
import Canvas from "./components/canvas/canvas";
import { useDownload } from "./hooks/download";

export default function App() {
  const stageRef = useRef<Konva.Stage|null>(null);
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState("#E94560");

  const downloadImage = useDownload(stageRef);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <Toolbar
          action={action}
          setAction={setAction}
          fillColor={fillColor}
          setFillColor={setFillColor}
          handleExport={downloadImage}
        />
        <Canvas stageRef={stageRef} action={action} fillColor={fillColor} />
      </div>
    </>
  );
}
