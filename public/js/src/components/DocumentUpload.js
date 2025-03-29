import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

const formatFileSize = (size) => {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
};

const truncateFileName = (name, maxLength = 11) => {
  if (!name) return "Document";
  if (name.length <= maxLength) return name;

  const extIndex = name.lastIndexOf(".");
  const ext = extIndex !== -1 ? name.slice(extIndex) : "";
  const baseName = name.slice(0, extIndex);
  const truncatedBase = baseName.slice(0, maxLength - ext.length - 3) + "...";
  return truncatedBase + ext;
};

const DocumentUpload = ({
  maxFileSizeMB = 5,
  acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.png",
  onFileChange,
  file: propFile,
  setFile: propSetFile,
}) => {

  const [internalFile, internalSetFile] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  const file = propFile ?? internalFile;
  const setFile = useCallback(
    (newFile) => {
      propSetFile ? propSetFile(newFile) : internalSetFile(newFile);
    },
    [propSetFile]
  );

  useEffect(() => {
    return () => {
      if (file?.fileURL) URL.revokeObjectURL(file.fileURL);
    };
  }, [file]);

  const handleFileChange = useCallback(
    (e) => {
      setError("");
      const selectedFile = e.target.files[0];
      e.target.value = "";

      if (selectedFile) {
        if (selectedFile.size > maxFileSizeMB * 1024 * 1024) {
          setError(`File size must be less than ${maxFileSizeMB}MB`);
          return;
        }

        const fileURL = URL.createObjectURL(selectedFile);
        const newFile = {
          name: selectedFile.name,
          size: selectedFile.size,
          fileURL,
          file: selectedFile,
        };

        setFile(newFile);
        onFileChange?.(newFile);
      }
    },
    [maxFileSizeMB, onFileChange, setFile]
  );

  const handleClear = useCallback(() => {
    setFile(null);
    onFileChange?.(null);
    setError("");
    fileInputRef.current.value = "";
    if (file?.fileURL) URL.revokeObjectURL(file.fileURL);
  }, [file?.fileURL, onFileChange, setFile]);

  const handleDownload = useCallback(() => {
    const url = file?.fileURL || file?.file_path;
    if (!url) return;

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name || url.split("/").pop() || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [file]);

  const fileExists = !!file && (file.fileURL || file.file_path);
  const displayName =
    file?.name || file?.file_path?.split("/").pop() || "Document";
  const displaySize = file?.size ? formatFileSize(file.size) : "Unknown size";

  return (
    <div className="document-upload">
      <div className="document-container">
        <button
          type="button"
          className="upload-button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload File"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9136 14.875H12.5864V12.6875H14.7739V12.0144H12.5864V9.82691H11.9136V12.0144H9.72606V12.6875H11.9136V14.875ZM12.25 15.8511C11.2751 15.8511 10.4481 15.5114 9.76894 14.8321C9.08965 14.1528 8.75 13.3258 8.75 12.3511C8.75 11.3762 9.08965 10.5491 9.76894 9.86978C10.4481 9.19064 11.2751 8.85106 12.25 8.85106C13.2249 8.85106 14.0519 9.19064 14.7311 9.86978C15.4104 10.5491 15.75 11.3762 15.75 12.3511C15.75 13.3258 15.4104 14.1528 14.7311 14.8321C14.0519 15.5114 13.2249 15.8511 12.25 15.8511ZM3.0625 4.13941H10.9375V3.26441H3.0625V4.13941ZM6.58109 14H1.41356C1.02477 14 0.691979 13.8616 0.415187 13.5848C0.138396 13.308 0 12.9752 0 12.5864V1.41356C0 1.02477 0.138396 0.691979 0.415187 0.415187C0.691979 0.138395 1.02477 0 1.41356 0H12.5864C12.9752 0 13.308 0.138395 13.5848 0.415187C13.8616 0.691979 14 1.02477 14 1.41356V6.61981C13.7117 6.52779 13.4226 6.45597 13.1327 6.40434C12.8426 6.35272 12.5484 6.32691 12.25 6.32691C11.955 6.32691 11.6681 6.35017 11.3892 6.39669C11.1105 6.44335 10.8366 6.50927 10.5674 6.59444V6.5625H3.0625V7.4375H8.82569C8.38367 7.74156 7.99524 8.09827 7.66041 8.50763C7.32557 8.91713 7.04988 9.36811 6.83331 9.86059H3.0625V10.7356H6.52706C6.46435 10.9823 6.41528 11.2311 6.37984 11.4818C6.34455 11.7326 6.32691 11.9887 6.32691 12.25C6.32691 12.518 6.34258 12.8123 6.37394 13.1327C6.40544 13.4529 6.47449 13.742 6.58109 14Z"
              fill="#023E84"
            />
          </svg>

          <span className="upload-text">&nbsp;Upload</span>
        </button>

        <input
          type="file"
          className="hidden-input"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          aria-label="Select file"
        />

        {error && <div className="file-error">{error}</div>}

        {fileExists ? (
          <div className="file-info">
            <div className="file-name" title={displayName}>
              <p>{truncateFileName(displayName)}</p>
              <span className="file-size">{displaySize}</span>
            </div>
            <div className="file-actions">
              <button
                type="button"
                onClick={handleDownload}
                aria-label="Download file"
                className="download-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleClear}
                aria-label="Remove file"
                className="clear-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="no-file"><i>No File Uploaded</i></div>
        )}
      </div>
    </div>
  );
};

DocumentUpload.propTypes = {
  maxFileSizeMB: PropTypes.number,
  acceptedFileTypes: PropTypes.string,
  onFileChange: PropTypes.func,
  file: PropTypes.shape({
    name: PropTypes.string,
    size: PropTypes.number,
    fileURL: PropTypes.string,
    file_path: PropTypes.string,
    file: PropTypes.instanceOf(File),
  }),
  setFile: PropTypes.func,
};

export default DocumentUpload;
