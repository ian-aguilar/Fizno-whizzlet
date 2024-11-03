import Image from "next/image";
import React from "react";
import uploadImg from "@/public/images/default_upload.png";

interface FileUploadProps {
  type?: string;
  component?: any;
  handleImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete?: () => void;
}

const SingleUploadComponent: React.FC<FileUploadProps> = ({
  component,
  handleImageChange,
  handleDelete,
}) => {
  // const [preview, setPreview] = useState<string | null>(null);

  console.log(component);
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="main_upload_section">
      <div>
        <div
          style={{
            borderRadius: "5px",
            textAlign: "center",
            cursor: "pointer",
          }}
          className="relative h-40 w-40 bordered_div border border-slate-200 dark:border-slate-700"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {!component?.url && (
            <div className="absolute top-0 w-full cursor-pointer">
              <input
                className="h-40 w-full"
                type="file"
                onChange={handleImageChange}
                accept=".jpg, .jpeg, .png"
                style={{ opacity: "0", cursor: "pointer" }}
              />
            </div>
          )}
          <div className="text-center">
            {component?.isUploaded ? (
              <div className="relative">
                <img
                  className="preview_img object-cover h-[160px] min-h-[160px] w-[160px] rounded-sm"
                  src={
                    component?.url
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${component?.url}`
                      : URL.createObjectURL(component?.item)
                  }
                  alt="Uploaded"
                />
                <div className="absolute top-1 right-1 flex action_btn_main">
                  {!component?.url && (
                    <button className="w-6 h-6 mr-2 relative bg-white flex items-center justify-center rounded-sm">
                      <input
                        className="h-40 w-full absolute"
                        type="file"
                        onChange={handleImageChange}
                        accept=".jpg, .jpeg, .png"
                        style={{ opacity: "0", cursor: "pointer" }}
                      />
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <circle cx="12" cy="12" r="3.2"></circle>
                        <path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Image
                  src={uploadImg}
                  alt="Upload"
                  className="h-30 w-30 rounded-sm mx-auto default_img"
                  width={120}
                  height={80}
                />
                <p
                  className="text-black font-bold mb-0"
                  style={{ fontSize: "9px" }}
                >
                  Drop your image here, or
                  <br />
                  <span className="text-blueLightTwo font-bold ml-1">
                    browse
                  </span>
                </p>
                <div className="absolute right-2 top-2 camera_btn">
                  <button className="flex justify-center w-7 h-7 relative ">
                    <svg
                      className="w-6 h-6"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <circle cx="12" cy="12" r="3.2"></circle>
                      <path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"></path>
                    </svg>{" "}
                    <input
                      className="h-40 w-full absolute"
                      type="file"
                      onChange={handleImageChange}
                      accept=".jpg, .jpeg, .png"
                      style={{ opacity: "0", cursor: "pointer" }}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUploadComponent;
