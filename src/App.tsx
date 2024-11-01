import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import Konva from "konva";
import {
  Arrow,
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
} from "react-konva";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "./constants/constants";
import Toolbar from "./components/toolbar/toolbar";

export default function App() {
  const stageRef = useRef<Konva.Stage>();
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState("#E94560");
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [scribbles, setScribbles] = useState([]);

  const strokeColor = "#000";
  const isPainting = useRef<boolean>(false);
  const currentShapeId = useRef<string | undefined>(undefined);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const isDraggable = action === ACTIONS.SELECT;

  const onPointerDown = () => {
    if (action === ACTIONS.SELECT) return;
    if (stageRef.current) {
      const stage = stageRef.current;
      const { x, y } = stage.getPointerPosition();
      const id = uuidv4();
      currentShapeId.current = id;
      isPainting.current = true;
      switch (action) {
        case ACTIONS.RECTANGLE:
          setRectangles((rectangles) => [
            ...rectangles,
            {
              id,
              x,
              y,
              height: 50,
              width: 50,
              fillColor,
            },
          ]);
          break;
        case ACTIONS.CIRCLE:
          setCircles((circle) => [
            ...circle,
            {
              id,
              x,
              y,
              radius: 20,
              fillColor,
            },
          ]);
          break;

        case ACTIONS.ARROW:
          setArrows((arrows) => [
            ...arrows,
            {
              id,
              points: [x, y, x + 20, y + 20],
              fillColor,
            },
          ]);
          break;
        case ACTIONS.SCRIBBLE:
          setScribbles((scribbles) => [
            ...scribbles,
            {
              id,
              points: [x, y],
              fillColor,
            },
          ]);
          break;
      }
    }
  };
  const onPointerMove = () => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;
    if (stageRef.current) {
      const stage = stageRef.current;
      const { x, y } = stage.getPointerPosition();
      switch (action) {
        case ACTIONS.RECTANGLE:
          setRectangles((rectangles) =>
            rectangles.map((rectangle) => {
              if (rectangle.id === currentShapeId.current) {
                return {
                  ...rectangle,
                  width: x - rectangle.x,
                  height: y - rectangle.y,
                };
              }
              return rectangle;
            })
          );
          break;
        case ACTIONS.CIRCLE:
          setCircles((circles) =>
            circles.map((circle) => {
              if (circle.id === currentShapeId.current) {
                return {
                  ...circle,
                  radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
                };
              }
              return circle;
            })
          );
          break;
        case ACTIONS.ARROW:
          setArrows((arrows) =>
            arrows.map((arrow) => {
              if (arrow.id === currentShapeId.current) {
                return {
                  ...arrow,
                  points: [arrow.points[0], arrow.points[1], x, y],
                };
              }
              return arrow;
            })
          );
          break;
        case ACTIONS.SCRIBBLE:
          setScribbles((scribbles) =>
            scribbles.map((scribble) => {
              if (scribble.id === currentShapeId.current) {
                return {
                  ...scribble,
                  points: [...scribble.points, x, y],
                };
              }
              return scribble;
            })
          );
          break;
      }
    }
  };

  const onPointerUp = () => {
    isPainting.current = false;
  };
  const handleExport = () => {
    if (stageRef.current) {
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = stageRef.current.toDataURL();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  function onClick(e: { currentTarget: any }) {
    if (action !== ACTIONS.SELECT) return;
    const target = e.currentTarget;
    transformerRef.current.nodes([target]);
  }

  const handleDragMoveRectangle = (e, id) => {
    const { x, y } = e.target.position();
    setRectangles((rectangles) =>
      rectangles.map((rectangle) =>
        rectangle.id === id ? { ...rectangle, x, y } : rectangle
      )
    );
  };

  const handleDragMoveCircle = (e, id) => {
    const { x, y } = e.target.position();
    setCircles((circles) =>
      circles.map((circle) => (circle.id === id ? { ...circle, x, y } : circle))
    );
  };

  const handleDragMoveArrow = (e, id) => {
    const { x, y } = e.target.position();
    setArrows((arrows) =>
      arrows.map((arrow) =>
        arrow.id === id
          ? {
              ...arrow,
              points: [x, y, arrow.points[2], arrow.points[3]],
            }
          : arrow
      )
    );
  };

  const handleDragMoveScribble = (e, id) => {
    const { x, y } = e.target.position();
    setScribbles((scribbles) =>
      scribbles.map((scribble) =>
        scribble.id === id
          ? { ...scribble, points: [x, y, ...scribble.points.slice(2)] }
          : scribble
      )
    );
  };

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <Toolbar
          action={action}
          setAction={setAction}
          fillColor={fillColor}
          setFillColor={setFillColor}
          handleExport={handleExport}
        />

        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              height={window.innerHeight}
              width={window.innerWidth}
              fill="#ffffff"
              id="bg"
              onClick={() => {
                transformerRef.current.nodes([]);
              }}
            />
            {rectangles.map((rectangle) => (
              <Rect
                key={rectangle.id}
                x={rectangle.x}
                y={rectangle.y}
                stroke={strokeColor}
                strokeWidth={2}
                fill={rectangle.fillColor}
                height={rectangle.height}
                width={rectangle.width}
                draggable={isDraggable}
                onClick={onClick}
                onDragMove={(e) => handleDragMoveRectangle(e, rectangle.id)}
                onDragEnd={(e) => handleDragMoveRectangle(e, rectangle.id)}
              />
            ))}
            {circles.map((circle) => (
              <Circle
                key={circle.id}
                radius={circle.radius}
                x={circle.x}
                y={circle.y}
                stroke={strokeColor}
                strokeWidth={2}
                fill={circle.fillColor}
                draggable={isDraggable}
                onClick={onClick}
                onDragMove={(e) => handleDragMoveCircle(e, circle.id)}
                onDragEnd={(e) => handleDragMoveCircle(e, circle.id)}
              />
            ))}

            {arrows.map((arrow) => (
              <Arrow
                key={arrow.id}
                points={arrow.points}
                stroke={strokeColor}
                strokeWidth={2}
                fill={arrow.fillColor}
                draggable={isDraggable}
                onClick={onClick}
                onDragMove={(e) => handleDragMoveArrow(e, arrow.id)}
                onDragEnd={(e) => handleDragMoveArrow(e, arrow.id)}
                hitStrokeWidth={20}
              />
            ))}
            {scribbles.map((scribble) => (
              <Line
                key={scribble.id}
                lineCap="round"
                lineJoin="round"
                points={scribble.points}
                stroke={strokeColor}
                strokeWidth={2}
                fill={scribble.fillColor}
                draggable={isDraggable}
                onClick={onClick}
                onDragMove={(e) => handleDragMoveScribble(e, scribble.id)}
                onDragEnd={(e) => handleDragMoveScribble(e, scribble.id)}
                hitStrokeWidth={20}
              />
            ))}
            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </div>
    </>
  );
}
