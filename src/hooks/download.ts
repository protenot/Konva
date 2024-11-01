import { RefObject } from "react";
import Konva from "konva";

export function useDownload(stageRef: RefObject<Konva.Stage>) {
  const downloadImage = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Stage reference is not available.");
    }
  };

  return downloadImage;
}
