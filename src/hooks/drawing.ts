import { useRef, useState } from "react";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from '../constants/constants'
import { useDragging } from "./dragging";

interface ShapeProps {
  id: string;
  x?: number;
  y?: number;
  fillColor: string;
  [key: string]: any;
  points?: number[];
}

export function useDrawing(stageRef: React.RefObject<Konva.Stage | null>, action: string, fillColor: string) {
  const transformerRef = useRef<Konva.Transformer>(null);
  const isPainting = useRef<boolean>(false);
  const currentShapeId = useRef<string | undefined>(undefined);

  const [rectangles, setRectangles] = useState<ShapeProps[]>([]);
  const [circles, setCircles] = useState<ShapeProps[]>([]);
  const [arrows, setArrows] = useState<ShapeProps[]>([]);
  const [scribbles, setScribbles] = useState<ShapeProps[]>([]);
  const [texts, setTexts] = useState<ShapeProps[]>([]);

  const isDraggable = action === ACTIONS.SELECT;

  const { handleDragMove, handleDragEnd } = useDragging({
    setRectangles,
    setCircles,
    setArrows,
    setScribbles,
    setTexts
  });

  const onPointerDown = () => {
    if (action === ACTIONS.SELECT) return;
    if (stageRef.current) {
      const stage = stageRef.current;
      const { x, y } = stage.getPointerPosition()!;
      const id = uuidv4();
      currentShapeId.current = id;
      isPainting.current = true;
      console.log("Pointer down at:", x, y);
      switch (action) {
        case ACTIONS.RECTANGLE:
          setRectangles((rectangles) => [
            ...rectangles,
            { id, x, y, height: 50, width: 50, fillColor },
          ]);
          break;
        case ACTIONS.CIRCLE:
          setCircles((circles) => [
            ...circles,
            { id, x, y, radius: 20, fillColor },
          ]);
          break;
        case ACTIONS.ARROW:
          setArrows((arrows) => [
            ...arrows,
            { id, points: [x, y, x + 20, y + 20], fillColor },
          ]);
          break;
        case ACTIONS.SCRIBBLE:
          setScribbles((scribbles) => [
            ...scribbles,
            { id, points: [x, y], fillColor },
          ]);
          break;
        case ACTIONS.TEXT:
          setTexts((texts) => [
            ...texts,
            { id, x, y, text: "New Text", fillColor },
          ]);
          break;
      }
    }
  };

  const onPointerMove = () => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;
    if (stageRef.current) {
      const stage = stageRef.current;
      const { x, y } = stage.getPointerPosition()!;

      switch (action) {
        case ACTIONS.RECTANGLE:
          setRectangles((rectangles) =>
            rectangles.map((rect) =>
              rect.id === currentShapeId.current
                ? { ...rect, width: x - rect.x, height: y - rect.y }
                : rect
            )
          );
          break;
        case ACTIONS.CIRCLE:
          setCircles((circles) =>
            circles.map((circle) =>
              circle.id === currentShapeId.current
                ? { ...circle, radius: Math.sqrt((y - circle.y) ** 2 + (x - circle.x) ** 2) }
                : circle
            )
          );
          break;
        case ACTIONS.ARROW:
          setArrows((arrows) =>
            arrows.map((arrow) =>
              arrow.id === currentShapeId.current
                ? { ...arrow, points: [arrow.points[0], arrow.points[1], x, y] }
                : arrow
            )
          );
          break;
        case ACTIONS.SCRIBBLE:
          setScribbles((scribbles) =>
            scribbles.map((scribble) =>
              scribble.id === currentShapeId.current
                ? { ...scribble, points: [...scribble.points, x, y] }
                : scribble
            )
          );
          break;
        case ACTIONS.TEXT:
          setTexts((texts) =>
            texts.map((text) =>
              text.id === currentShapeId.current
                ? { ...text, x, y } 
                : text
            )
          );
          break;
      }
    }
  };

  const onPointerUp = () => {
    isPainting.current = false;
  };

  const onClick = (e: any) => {
    if (action !== ACTIONS.SELECT) return;
    const target = e.target;
    transformerRef.current?.nodes([target]);
    transformerRef.current?.getLayer()?.batchDraw();
  };

  return {
    stageRef,
    transformerRef,
    rectangles,
    circles,
    arrows,
    scribbles,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    handleDragMove,
    handleDragEnd,
    isDraggable,
    onClick,
    texts
  };
}
