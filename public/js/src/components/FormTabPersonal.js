import React, { useState, useEffect, useRef } from "react";
import DocumentUpload from "./DocumentUpload"; // Adjust the path based on your file structure


function FormTabPersonal({ personalData, studentId }) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    dateOfBirth: "",
    genderId: "",
    maritalStatus: "",
    nationality: "",
    passportNumber: "",
    cityOfBirth: "",
  });

  const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [passportDocument, setPassportDocument] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null); // Store the selected file
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null); // Ref for the file input

  useEffect(() => {
    if (personalData) {
      setFormData({
        name: personalData.personalData?.name || "",
        surname: personalData.personalData?.surname || "",
        dateOfBirth: personalData.personalData?.dateOfBirth || "",
        genderId: personalData.personalData?.genderId || "",
        maritalStatus: personalData.personalData?.maritalStatus || "",
        nationality: personalData.personalData?.nationality || "",
        passportNumber: personalData.personalData?.passportNumber || "",
        cityOfBirth: personalData.personalData?.cityOfBirth || "",
      });

      setPassportDocument(personalData.passportDocument || null);
      console.log("FormTabPersonal - useEffect - personalData.passportDocument:", personalData.passportDocument); // *** ADD THIS LOG ***
      setMaritalStatusOptions(personalData.maritalStatuses || []);
      setNationalityOptions(personalData.nationalities || []);
    }
  }, [personalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (fileData) => {
    console.log("FormTabPersonal - handleFileChange - fileData received:", fileData);
  
    if (fileData) {
      setFileToUpload(fileData.file);
      setPassportDocument({
        // Merge existing server data with new upload
        ...passportDocument,
        name: fileData.name,
        size: fileData.size,
        fileURL: fileData.fileURL,
        file: fileData.file,
        file_path: null, // Clear server path until uploaded
        to_be_deleted: false // Reset deletion flag
      });
    } else {
      setFileToUpload(null);
      if (passportDocument?.document_id) {
        // Keep document_id but mark for deletion
        setPassportDocument({
          ...passportDocument,
          fileURL: null,
          file_path: null,
          to_be_deleted: true
        });
      } else {
        // Clear completely if no server document
        setPassportDocument(null);
      }
    }
  };


  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    setErrorMessage("");

    const token = localStorage.getItem("studentPortalToken");
    if (!token) {
      setErrorMessage("You are not logged in. Please log in to continue.");
      setIsSaving(false);
      return;
    }

    try {
      // --- 1. Prepare FormData ---
      const formDataToSend = new FormData();

      // Append using the state's formData
      formDataToSend.append("name", formData.name);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("genderId", formData.genderId);
      formDataToSend.append("maritalStatus", formData.maritalStatus);
      formDataToSend.append("nationality", formData.nationality);
      formDataToSend.append("passportNumber", formData.passportNumber);
      formDataToSend.append("cityOfBirth", formData.cityOfBirth);

      // Append file if a new file is selected, or if we need to delete the existing one
      if (fileToUpload) {
        formDataToSend.append("passport", fileToUpload); // 'passport' is the key
        formDataToSend.append("document_type_id", 1); // Always 1 for passport
      }

      // Append document_id if deleting or updating existing document.
      if (passportDocument && passportDocument.document_id) {
        formDataToSend.append("document_id", passportDocument.document_id);
      }
      //Append a flag to check if we have to delete in backend.
      if (passportDocument && passportDocument.to_be_deleted) {
        formDataToSend.append("to_be_deleted", true);
      }

      const response = await fetch(
        "/wp-json/student-portal/v1/update-personal",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // No Content-Type for FormData
          },
          body: formDataToSend, // Send FormData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update personal data.");
      }

      const data = await response.json(); // Expect a response, even if it's just a message.
      setMessage("Personal details saved successfully!");

      // --- 3. Reset state ---
      setFileToUpload(null); // Clear the selected file
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }

      //If uploaded a new file then update the state.
      if (data.passportDocument) {
        setPassportDocument({
          ...data.passportDocument,
          // Maintain any temporary URL until page refresh
          fileURL: data.passportDocument.file_path || passportDocument?.fileURL
        });
      }
      // If marked for deletion, then no need to update. Because it will set to null in backend.
    } catch (error) {
      console.error("Error saving data:", error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    // Make async

    if (!passportDocument || !passportDocument.document_id) {
      console.error("Passport document or ID is missing.");
      return; //should not reach here.
    }

    //if (!window.confirm("Are you sure you want to delete your passport?")) return; //Confirm in handlesave.

    //setUploading(true); // Use uploading state for consistency
    setMessage("");
    setErrorMessage("");

    const token = localStorage.getItem("studentPortalToken");
    if (!token) {
      setErrorMessage("You are not logged in. Please log in to continue.");
      //setUploading(false);
      return; // Stop execution
    }

    try {
      const response = await fetch(
        `/wp-json/student-portal/v1/delete-document/${passportDocument.document_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete passport.");
      }
      //If successfully deleted from the database.
      //If the deleted file was new file, then no need to do anything.
      if (passportDocument.document_id) {
        //it is from database.
        setPassportDocument(null);
      }
      setMessage("Passport deleted successfully!"); //set message.
    } catch (error) {
      console.error("Delete failed:", error);
      setErrorMessage(error.message);
    } finally {
      //setUploading(false); //we are using isSaving state.
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup any blob URLs when component unmounts
      if (passportDocument?.fileURL) {
        URL.revokeObjectURL(passportDocument.fileURL);
      }
    };
  }, [passportDocument]);


  return (
    <div className="form-tab-personal">
      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="section-header">
        <p>Personal Information</p>
        <small>You can view or update your personal information.</small>
      </div>
      {personalData ? (
        <>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. John Doe"
                value={formData.name || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="surname">Surname</label>
              <input
                type="text"
                id="surname"
                name="surname"
                placeholder="Surname"
                value={formData.surname || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="genderId">Gender</label>
              <select
                id="genderId"
                name="genderId"
                value={formData.genderId || ""}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="maritalStatus">Marital Status</label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus || ""}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                {maritalStatusOptions.map((status) => (
                  <option key={status.status_id} value={status.status_id}>
                    {status.status_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="nationality">Nationality</label>
              <select
                id="nationality"
                name="nationality"
                value={formData.nationality || ""}
                onChange={handleChange}
              >
                <option value="">Select Country</option>
                {nationalityOptions.map((nation) => (
                  <option
                    key={nation.nationality_id}
                    value={nation.nationality_id}
                  >
                    {nation.nationality_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="passportNumber">Passport Number</label>
              <input
                type="text"
                id="passportNumber"
                name="passportNumber"
                placeholder="e.g. A4546878"
                value={formData.passportNumber || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="cityOfBirth">City of Birth</label>
              <input
                type="text"
                id="cityOfBirth"
                name="cityOfBirth"
                placeholder="e.g. New York"
                value={formData.cityOfBirth || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="section-header">
            <p>Passport Document</p>
            <small>You can view, upload, or delete your passport.</small>
          </div>
          <div className="form-upload-section">
          <label>Portfolio</label>
          <DocumentUpload 
            file={passportDocument}
            setFile={handleFileChange}
            onFileChange={(newFile) => {
              // Immediate preview update
              if (newFile) {
                setPassportDocument(prev => ({
                  ...prev,
                  fileURL: newFile.fileURL,
                  name: newFile.name,
                  size: newFile.size
                }));
              }
            }}
          />
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </>
      ) : (
        <p>Loading personal data...</p>
      )}
    </div>
  );
}

export default FormTabPersonal;
