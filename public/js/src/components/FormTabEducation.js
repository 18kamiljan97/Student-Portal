import React, { useState, useEffect, useRef } from "react";
import DocumentUpload from "./DocumentUpload";

function FormTabEducation({ educationData }) {
  const [degrees, setDegrees] = useState([]);
  const [degreeTypes, setDegreeTypes] = useState([]);
  const [degreeStatuses, setDegreeStatuses] = useState([]);
  const [newDegree, setNewDegree] = useState({
    degree_type_id: "",
    status_id: "",
    school_name: "",
    school_country: "",
    school_city: "",
    department: "",
    start_date: "",
    end_date: "",
    grade: "",
    documents: [],
  });
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const diplomaInputRef = useRef(null);
  const transcriptInputRef = useRef(null);
  const cvInputRef = useRef(null);
  const portfolioInputRef = useRef(null);

  useEffect(() => {
    if (educationData) {
      setDegrees(educationData.studentDegrees || []);
      setDegreeTypes(educationData.degreeTypes || []);
      setDegreeStatuses(educationData.degreeStatuses || []);
    }
  }, [educationData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDegree({ ...newDegree, [name]: value });
  };

  const handleFileChange = (fileData, document_type_id) => {
    setNewDegree((prev) => {
      const existingIndex = prev.documents.findIndex(
        (doc) => doc.document_type_id === document_type_id
      );

      // Handle file removal
      if (!fileData) {
        const updatedDocs = prev.documents.filter(
          (doc) => doc.document_type_id !== document_type_id
        );
        return { ...prev, documents: updatedDocs };
      }

      // Handle new/updated file
      const newDoc = {
        document_type_id,
        name: fileData.name || prev.documents[existingIndex]?.name,
        size: fileData.size || prev.documents[existingIndex]?.size,
        file: fileData.file || null,
        fileURL: fileData.fileURL || prev.documents[existingIndex]?.fileURL,
        file_path:
          fileData.file_path || prev.documents[existingIndex]?.file_path,
        document_id: prev.documents[existingIndex]?.document_id,
      };

      if (existingIndex > -1) {
        const updatedDocs = [...prev.documents];
        updatedDocs[existingIndex] = newDoc;
        return { ...prev, documents: updatedDocs };
      }

      return { ...prev, documents: [...prev.documents, newDoc] };
    });
  };

  const getDegreeTypeName = (typeId) => {
    const type = degreeTypes.find((t) => t.type_id === typeId);
    return type ? type.type_name : "";
  };

  const getStatusName = (statusId) => {
    const status = degreeStatuses.find((s) => s.status_id === statusId);
    return status ? status.status_name : "";
  };

  const handleAddOrEditDegree = async () => {
    setLoading(true);
    setMessage(null);
    setErrorMessage(null);

    if (
      !newDegree.degree_type_id ||
      !newDegree.status_id ||
      !newDegree.school_name ||
      !newDegree.school_country ||
      !newDegree.school_city ||
      !newDegree.start_date
    ) {
      setErrorMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (
      newDegree.end_date &&
      new Date(newDegree.end_date) <= new Date(newDegree.start_date)
    ) {
      setErrorMessage("End date must be after start date.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("degree_type_id", newDegree.degree_type_id);
    formData.append("status_id", newDegree.status_id);
    formData.append("school_name", newDegree.school_name);
    formData.append("school_country", newDegree.school_country);
    formData.append("school_city", newDegree.school_city);
    formData.append("department", newDegree.department);
    formData.append("start_date", newDegree.start_date);
    formData.append("end_date", newDegree.end_date);
    formData.append("grade", newDegree.grade);

    newDegree.documents.forEach((doc) => {
      if (doc.file) {
        formData.append("documents[]", doc.file);
        formData.append("document_types[]", doc.document_type_id);
      }
    });

    if (isEditing) {
      formData.append("degree_id", isEditing);
    }

    try {
      const endpoint = isEditing
        ? "/wp-json/student-portal/v1/edit-education"
        : "/wp-json/student-portal/v1/add-education";
      const method = "POST";

      const token = localStorage.getItem("studentPortalToken");
      if (!token) {
        console.error("No token found.  User is likely not logged in.");
        setErrorMessage("You are not logged in. Please log in to continue.");
        // Example:  window.location.href = '/login';
        return;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }

      const data = await response.json();

      if (isEditing) {
        const updatedDegrees = degrees.map((degree) => {
          if (degree.degree_id === isEditing) {
            return {
              ...degree,
              ...newDegree,
              degree_id: isEditing,
              documents:
                data.documents.length > 0 ? data.documents : degree.documents,
              degree_type: getDegreeTypeName(newDegree.degree_type_id),
              status_name: getStatusName(newDegree.status_id),
            };
          }
          return degree;
        });
        setDegrees(updatedDegrees);
        setIsEditing(null);
        setMessage("Education updated successfully");
      } else {
        setDegrees([
          ...degrees,
          {
            ...newDegree,
            degree_id: data.degree_id,
            documents: data.documents,
            degree_type: getDegreeTypeName(newDegree.degree_type_id),
            status_name: getStatusName(newDegree.status_id),
          },
        ]);
        setMessage("Education added successfully!");
      }
    } catch (error) {
      console.error(
        isEditing ? "Error updating degree:" : "Error adding degree:",
        error
      );
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
      setNewDegree({
        degree_type_id: "",
        status_id: "",
        school_name: "",
        school_country: "",
        school_city: "",
        department: "",
        start_date: "",
        end_date: "",
        grade: "",
        documents: [],
      });

      if (diplomaInputRef.current) diplomaInputRef.current.value = "";
      if (transcriptInputRef.current) transcriptInputRef.current.value = "";
      if (cvInputRef.current) cvInputRef.current.value = "";
      if (portfolioInputRef.current) portfolioInputRef.current.value = "";
    }
  };

  const handleEdit = (degreeId) => {
    setMessage(null);
    const degreeToEdit = degrees.find(
      (degree) => degree.degree_id === degreeId
    );

    if (degreeToEdit) {
      setIsEditing(degreeId);
      const documentsCopy =
        degreeToEdit.documents?.map((doc) => ({
          document_type_id: doc.document_type_id,
          document_id: doc.document_id,
          name: doc.name,
          size: doc.size,
          file_path: doc.file_path, // Server path
          fileURL: doc.file_path, // Use server path for preview
          file: null, // Clear actual file until new upload
        })) || [];

      setNewDegree({
        degree_type_id: degreeToEdit.degree_type_id,
        status_id: degreeToEdit.status_id,
        school_name: degreeToEdit.school_name,
        school_country: degreeToEdit.school_country,
        school_city: degreeToEdit.school_city,
        department: degreeToEdit.department,
        start_date: degreeToEdit.start_date,
        end_date: degreeToEdit.end_date,
        grade: degreeToEdit.grade,
        documents: documentsCopy,
      });
    }
  };

  const handleDelete = async (degreeId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this degree and its associated documents?"
      )
    ) {
      setLoading(true);
      setMessage(null);
      try {
        const token = localStorage.getItem("studentPortalToken");
        if (!token) {
          setMessage("You are not logged in.");
          return;
        }
        const response = await fetch(
          `/wp-json/student-portal/v1/delete-education?degree_id=${degreeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorData.message}`
          );
        }

        const updatedDegrees = degrees.filter(
          (degree) => degree.degree_id !== degreeId
        );
        setDegrees(updatedDegrees);
        setMessage("Education deleted successfully!");
        setErrorMessage("");
      } catch (error) {
        console.error("Error deleting degree:", error);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate) {
      return "";
    }

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    if (end < start) {
      return "";
    }

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    const totalMonths = years * 12 + months;
    const finalYears = Math.floor(totalMonths / 12);
    const finalMonths = totalMonths % 12;

    let durationString = "";
    if (finalYears > 0) {
      durationString += `${finalYears} year${finalYears > 1 ? "s" : ""}`;
    }
    if (finalMonths > 0) {
      durationString += ` ${finalMonths} month${finalMonths > 1 ? "s" : ""}`;
    }
    return durationString.trim();
  };

  return (
    <div className="form-tab-education">
      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="form-upload-section">
        <div className="section-header">
          <p>Education Information</p>
          <small>You can view or update your contact information.</small>
        </div>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="degree_type_id">Degree Type</label>
            <select
              id="degree_type_id"
              name="degree_type_id"
              value={newDegree.degree_type_id}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Degree Type</option>
              {degreeTypes.map((type) => (
                <option key={type.type_id} value={type.type_id}>
                  {type.type_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status_id">Status</label>
            <select
              id="status_id"
              name="status_id"
              value={newDegree.status_id}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Status</option>
              {degreeStatuses.map((status) => (
                <option key={status.status_id} value={status.status_id}>
                  {status.status_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="school_name">University</label>
            <input
              type="text"
              id="school_name"
              name="school_name"
              value={newDegree.school_name}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="school_country">Country</label>
            <select
              id="school_country"
              name="school_country"
              value={newDegree.school_country}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Country</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="school_city">City</label>
            <select
              id="city"
              name="school_city"
              value={newDegree.school_city}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select City</option>
              <option value="Istanbul">Istanbul</option>
              <option value="Kabul">Kabul</option>
              <option value="Tirana">Tirana</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={newDegree.department}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="start_date">Start Year</label>
            <input
              type="number"
              id="start_date"
              name="start_date"
              value={newDegree.start_date}
              onChange={handleInputChange}
              className="form-control"
              min="1900"
              max="2100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">End Year</label>
            <input
              type="number"
              id="end_date"
              name="end_date"
              value={newDegree.end_date}
              onChange={handleInputChange}
              className="form-control"
              min="1900"
              max="2100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="grade">Grade</label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={newDegree.grade}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Diploma</label>
            <DocumentUpload
              file={newDegree.documents.find((d) => d.document_type_id === 7)}
              setFile={(fileData) => handleFileChange(fileData, 7)}
              acceptedFileTypes=".pdf,.doc,.docx,.jpg,.png"
              maxFileSizeMB={5}
              documentType="Diploma" // Optional: for better error messages
            />
          </div>

          <div className="form-group">
            <label>Transcript</label>
            <DocumentUpload
              file={newDegree.documents.find((d) => d.document_type_id === 8)}
              setFile={(fileData) => handleFileChange(fileData, 8)}
              acceptedFileTypes=".pdf,.doc,.docx,.jpg,.png"
              maxFileSizeMB={5}
              documentType="Transcript" // Optional: for better error messages
            />
          </div>

          <div className="form-group">
            <label>CV</label>
            <DocumentUpload
              file={newDegree.documents.find((d) => d.document_type_id === 10)}
              setFile={(fileData) => handleFileChange(fileData, 10)}
              acceptedFileTypes=".pdf,.doc,.docx,.jpg,.png"
              maxFileSizeMB={5}
              documentType="CV" // Optional: for better error messages
            />
          </div>
          <div className="form-group">
            <label>Portfolio</label>
            <DocumentUpload
              file={newDegree.documents.find((d) => d.document_type_id === 11)}
              setFile={(fileData) => handleFileChange(fileData, 11)}
              acceptedFileTypes=".pdf,.doc,.docx,.jpg,.png"
              maxFileSizeMB={5}
              documentType="Portfolio" // Optional: for better error messages
            />
          </div>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddOrEditDegree}
            disabled={loading}
          >
            {loading
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
              ? "Save Education"
              : "Add Education"}
          </button>
        </div>
      </div>

      <div className="education-list">
        {degrees.length === 0 ? (
          <p>No education entries added yet.</p>
        ) : (
          <table className="application-table">
            <thead>
              <tr>
                <th>Degree</th>
                <th>Country</th>
                <th>School</th>
                <th>Department</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {degrees.map((degree) => (
                <tr key={degree.degree_id}>
                  <td>{degree.degree_type}</td>
                  <td>{degree.school_country}</td>
                  <td>{degree.school_name}</td>
                  <td>{degree.department}</td>
                  <td>{degree.status_name}</td>
                  <td>
                    {degree.start_date && (
                      <span>
                        {degree.end_date
                          ? `${degree.start_date} - ${degree.end_date}`
                          : `${degree.start_date} - Present`}
                        ({calculateDuration(degree.start_date, degree.end_date)}
                        )
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                    <button
                      type="button"
                      className="btn btn-edit"
                      onClick={() => handleEdit(degree.degree_id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-delete"
                      onClick={() => handleDelete(degree.degree_id)}
                    >
                      Delete
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FormTabEducation;
