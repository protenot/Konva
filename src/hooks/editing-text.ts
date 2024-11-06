import { useState } from "react";
import { ShapeProps } from "./drawing";
import { ACTIONS } from "../constants/constants";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

export function useEditingText(
  texts: ShapeProps[],
  setTexts: React.Dispatch<React.SetStateAction<ShapeProps[]>>,
  stageRef: React.RefObject<Konva.Stage>,
  action: string,
  fillColor: string
) {
  const [editingText, setEditingText] = useState<ShapeProps | null>(null);
  const [inputValue, setInputValue] = useState("");
 
  const onDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
    if (action !== ACTIONS.SELECT) return;

    const clickedShape = e.target as Konva.Text;
    const { x, y, width, height } = clickedShape.getClientRect();
    const stageBox = stageRef.current!.container().getBoundingClientRect();

    setEditingText({
      id: clickedShape.id(),
      x: stageBox.left + x,
      y: stageBox.top + y,
      width,
      height,
      fillColor,
      text: clickedShape.text(),
    });
    setInputValue(clickedShape.text());
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setTexts((texts) =>
      texts.map((text) =>
        text.id === editingText?.id ? { ...text, text: newValue } : text
      )
    );
    setEditingText((prev) => (prev ? { ...prev, text: newValue } : null));
  };

  const handleInputBlur = () => {
    setTexts((texts) =>
      texts.map((text) =>
        text.id === editingText?.id ? { ...text, text: inputValue } : text
      )
    );
    setEditingText(null);
  };

  return {
    texts,
    setTexts,
    editingText,
    setEditingText,
    inputValue,
    setInputValue,
    onDoubleClick,
    handleInputChange,
    handleInputBlur,
  };
}
