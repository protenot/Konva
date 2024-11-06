import ReactDOM from "react-dom";
import {
  Stage,
  Layer,
  Transformer,
  Rect,
  Circle,
  Arrow,
  Line,
  Text,
} from "react-konva";
import { useDrawing } from "../../hooks/drawing";
import { RefObject } from "react";
import Konva from "konva";
import { useEditingText } from "../../hooks/editing-text";

interface CanvasProps {
  stageRef: RefObject<Konva.Stage | null>;
  action: string;
  fillColor: string;
}

export default function Canvas({ stageRef, action, fillColor }: CanvasProps) {
  const strokeColor = "#000";
  const {
    texts,
    rectangles,
    circles,
    arrows,
    scribbles,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    transformerRef,
    isDraggable,
    onClick,
    handleDragMove,
    handleDragEnd,
    setTexts,
  } = useDrawing(stageRef, action, fillColor);

  const {
    editingText,
    inputValue,
    onDoubleClick,
    handleInputChange,
    handleInputBlur,
  } = useEditingText(texts, setTexts, stageRef, action, fillColor);

  return (
    <>
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
              onDragMove={(e) => handleDragMove(e, rectangle.id, "RECTANGLE")}
              onDragEnd={(e) => handleDragEnd(e, rectangle.id, "RECTANGLE")}
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
              onDragMove={(e) => handleDragMove(e, circle.id, "CIRCLE")}
              onDragEnd={(e) => handleDragEnd(e, circle.id, "CIRCLE")}
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
              onDragMove={(e) => handleDragMove(e, arrow.id, "ARROW")}
              onDragEnd={(e) => handleDragEnd(e, arrow.id, "ARROW")}
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
              onDragMove={(e) => handleDragMove(e, scribble.id, "SCRIBBLE")}
              onDragEnd={(e) => handleDragEnd(e, scribble.id, "SCRIBBLE")}
              hitStrokeWidth={20}
            />
          ))}
          {texts.map((text) => (
            <Text
              key={text.id}
              id={text.id}
              text={text.id === editingText?.id ? inputValue : text.text}
              x={text.x}
              y={text.y}
              fill={text.fillColor}
              fontSize={20}
              draggable={isDraggable}
              onDragMove={(e) => handleDragMove(e, text.id, "TEXT")}
              onDragEnd={(e) => handleDragEnd(e, text.id, "TEXT")}
              onClick={onClick}
              onDblClick={(e) => onDoubleClick(e)}
            />
          ))}

          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
      {editingText &&
        ReactDOM.createPortal(
          <input
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              width: "300px",
              fontSize: "20px",
              border: "1px solid black",
              outline: "none",
              background: "transparent",
              color: fillColor,
            }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            autoFocus
          />,
          document.body
        )}
    </>
  );
}
