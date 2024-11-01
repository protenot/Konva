import { useCallback } from "react";

interface UseDraggingProps {
  setRectangles: React.Dispatch<React.SetStateAction<any[]>>;
  setCircles: React.Dispatch<React.SetStateAction<any[]>>;
  setArrows: React.Dispatch<React.SetStateAction<any[]>>;
  setScribbles: React.Dispatch<React.SetStateAction<any[]>>;
}

export function useDragging({ setRectangles, setCircles, setArrows, setScribbles }: UseDraggingProps) {
  
  const handleDragMove = useCallback((e, id, shapeType) => {
    const { x, y } = e.target.position();
    switch (shapeType) {
      case "rectangle":
        setRectangles((rectangles) =>
          rectangles.map((rect) => (rect.id === id ? { ...rect, x, y } : rect))
        );
        break;
      case "circle":
        setCircles((circles) =>
          circles.map((circle) => (circle.id === id ? { ...circle, x, y } : circle))
        );
        break;
      case "arrow":
        setArrows((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === id) {
              const [startX, startY] = arrow.points;
              return { ...arrow, points: [startX, startY, x, y] };
            }
            return arrow;
          })
        );
        break;
      case "scribble":
        setScribbles((scribbles) =>
          scribbles.map((scribble) =>
            scribble.id === id ? { ...scribble, points: [...scribble.points, x, y] } : scribble
          )
        );
        break;
      default:
        break;
    }
  }, [setRectangles, setCircles, setArrows, setScribbles]);

  const handleDragEnd = useCallback((e, id, shapeType) => {
    const { x, y } = e.target.position();
    switch (shapeType) {
      case "rectangle":
        setRectangles((rectangles) =>
          rectangles.map((rect) => (rect.id === id ? { ...rect, x, y } : rect))
        );
        break;
      case "circle":
        setCircles((circles) =>
          circles.map((circle) => (circle.id === id ? { ...circle, x, y } : circle))
        );
        break;
      case "arrow":
        setArrows((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === id) {
              const [startX, startY] = arrow.points;
              return { ...arrow, points: [startX, startY, x, y] };
            }
            return arrow;
          })
        );
        break;
      case "scribble":
        setScribbles((scribbles) =>
          scribbles.map((scribble) =>
            scribble.id === id ? { ...scribble, points: [...scribble.points, x, y] } : scribble
          )
        );
        break;
      default:
        break;
    }
  }, [setRectangles, setCircles, setArrows, setScribbles]);

  return {
    handleDragMove,
    handleDragEnd,
  };
}
