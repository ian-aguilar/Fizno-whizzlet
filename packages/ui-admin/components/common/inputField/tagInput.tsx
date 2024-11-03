/* eslint-disable prettier/prettier */
import React from "react";

interface TagInputProps {
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (index: number) => void;
  hideRemove?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  inputValue,
  onInputChange,
  onAddTag,
  onRemoveTag,
  hideRemove,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onAddTag();
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        {tags.map((tag, index) => (
          <div
            className="inline-flex items-center bg-primaryMain text-white py-1 px-3 rounded-xl"
            key={index}
          >
            <span>{tag}</span>
            {!hideRemove && (
              <button
                onClick={() => onRemoveTag(index)}
                style={{
                  background: "none",
                  border: "none",
                  marginLeft: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type something and press Enter"
        className="border-slate-200  border p-2 w-full rounded "
      />
    </div>
  );
};

export default TagInput;
