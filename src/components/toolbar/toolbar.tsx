import { GiArrowCursor } from "react-icons/gi";
import { TbRectangle } from "react-icons/tb";
import { FaRegCircle, FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { IoMdDownload } from "react-icons/io";
import { ACTIONS } from "../../constants/constants";

export default function Toolbar({action, setAction, fillColor, setFillColor, handleExport }) {
    const getButtonClass = (expectedAction: string) =>
        action === expectedAction ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded";
    
    return (
    <div className="absolute top-0 z-10 w-full py-2">
      <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg">
        <button className={getButtonClass(ACTIONS.SELECT)} onClick={() => setAction(ACTIONS.SELECT)}>
          <GiArrowCursor size="2rem" />
        </button>
        <button className={getButtonClass(ACTIONS.RECTANGLE)} onClick={() => setAction(ACTIONS.RECTANGLE)}>
          <TbRectangle size="2rem" />
        </button>
        <button className={getButtonClass(ACTIONS.CIRCLE)} onClick={() => setAction(ACTIONS.CIRCLE)}>
          <FaRegCircle size="1.5rem" />
        </button>
        <button className={getButtonClass(ACTIONS.ARROW)} onClick={() => setAction(ACTIONS.ARROW)}>
          <FaLongArrowAltRight size="2rem" />
        </button>
        <button className={getButtonClass(ACTIONS.SCRIBBLE)} onClick={() => setAction(ACTIONS.SCRIBBLE)}>
          <LuPencil size="1.5rem" />
        </button>
        <input
          type="color"
          value={fillColor}
          onChange={(e) => setFillColor(e.target.value)}
          className="w-6 h-6"
        />
        <button onClick={handleExport}>
          <IoMdDownload size="1.5rem" />
        </button>
      </div>
    </div>
  );
}
