import React, { useState } from "react";
import SVG from "../../../public/svg";

interface ColorPickerProps {
  onSelect?: (color: string, event: any) => void; // Update type to accept the event
  label: string;
  value?: string;
}

const ColorPicker = ({ onSelect, label, value }: ColorPickerProps) => {
  // const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorSelect = (color: string, event: any) => {
    if (onSelect) {
      onSelect(color, event); // Call the parent's function with both color and event
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    if (onSelect) {
      onSelect(color, event); // Call the parent's function with both color and event
    }
  };

  const colors = [
    "#FF0000",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#FF00FF",
    "#FF4500",
  ];

  return (
    <>
      {label && (
        <label className="block text-zinc-600 text-sm font-bold mb-1 w-full">
          {label}
        </label>
      )}
      <div className="flex items-center gap-4 mt-2 mb-6">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-300 ${
              value === color ? "ring-2 ring-offset-2 ring-gray-500" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={(event) => handleColorSelect(color, event)} // Pass the event
          />
        ))}
        <div className="cursor-pointer relative w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 hover:border-gray-400">
          <span>
            <SVG.ColorPckerImg />
          </span>
          <div className="absolute top-0 left-0">
            <input
              type="color"
              className="w-8 h-8 opacity-0 z-10 cursor-pointer"
              onChange={handleInputChange} // Handle color selection
            />
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="flex font-medium ">
          Selected Color:
          <div
            className="rounded-sm ml-2 h-7 w-7"
            style={{ backgroundColor: value || "transparent" }} // Use selectedColor to set background color
          ></div>
        </div>
      </div>
    </>
  );
};

export default ColorPicker;
