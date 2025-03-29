import React, { useState, useEffect } from "react";
import DocumentUpload from "./DocumentUpload";

function FormTabLanguage({ languageData }) {
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);
  const [newLanguage, setNewLanguage] = useState({
    language_name: "",
    level_id: "",
    language_cert_file: null, // Will now store the full document object
  });
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (languageData) {
      setLanguages(languageData.studentLanguages || []);
      setLevels(languageData.languageLevels || []);
    }
  }, [languageData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLanguage((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (fileData) => {
    setNewLanguage((prev) => ({
      ...prev,
      language_cert_file: fileData
        ? {
            name: fileData.name,
            size: fileData.size,
            fileURL: fileData.fileURL,
            file_path: fileData.file_path,
            file: fileData.file,
          }
        : null,
    }));
  };

  const getLevelName = (levelId) => {
    const level = levels.find((l) => l.level_id === levelId);
    return level ? level.level_name : "";
  };

  const handleAddLanguage = async () => {
    setLoading(true);
    setMessage(null);
    setErrorMessage(null);

    if (!newLanguage.language_name || !newLanguage.level_id) {
      setErrorMessage("Please select a language and level.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("language_name", newLanguage.language_name);
    formData.append("level_id", newLanguage.level_id);

    if (newLanguage.language_cert_file?.file) {
      formData.append(
        "language_cert_file",
        newLanguage.language_cert_file.file
      );
    }

    try {
      const endpoint = isEditing
        ? "/wp-json/student-portal/v1/edit-language"
        : "/wp-json/student-portal/v1/add-language";

      const method = "POST";
      const token = localStorage.getItem("studentPortalToken");

      if (isEditing) {
        formData.append("language_id", isEditing);
        if (newLanguage.language_cert_file?.document_id) {
          formData.append(
            "document_id",
            newLanguage.language_cert_file.document_id
          );
        }
      }

      const response = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      const data = await response.json();

      setLanguages((prev) => {
        const updated = isEditing
          ? prev.map((lang) =>
              lang.language_id === isEditing
                ? {
                    ...lang,
                    ...newLanguage,
                    language_id: isEditing,
                    language_cert_file:
                      data.file_path || lang.language_cert_file,
                    level_name: getLevelName(newLanguage.level_id),
                  }
                : lang
            )
          : [
              ...prev,
              {
                ...newLanguage,
                language_id: data.language_id,
                language_cert_file: data.file_path,
                level_name: getLevelName(newLanguage.level_id),
              },
            ];

        return updated;
      });

      setMessage(
        isEditing
          ? "Language updated successfully!"
          : "Language added successfully!"
      );
      setIsEditing(null);
      setNewLanguage({
        language_name: "",
        level_id: "",
        language_cert_file: null,
      });
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (languageId) => {
    const languageToEdit = languages.find(
      (lang) => lang.language_id === languageId
    );
    if (languageToEdit) {
      setIsEditing(languageId);
      setNewLanguage({
        language_name: languageToEdit.language_name,
        level_id: languageToEdit.level_id,
        language_cert_file: languageToEdit.language_cert_file
          ? {
              file_path: languageToEdit.language_cert_file,
              name: languageToEdit.language_cert_file.split("/").pop(),
            }
          : null,
      });
    }
  };

  const handleDelete = async (languageId) => {
    if (window.confirm("Are you sure you want to delete this language?")) {
      try {
        const token = localStorage.getItem("studentPortalToken");
        const response = await fetch(
          `/wp-json/student-portal/v1/delete-language?language_id=${languageId}`,
          { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Delete failed");

        setLanguages((prev) =>
          prev.filter((lang) => lang.language_id !== languageId)
        );
        setMessage("Language deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="form-tab-language">
      {message && <div className="success-message">{message}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="form-upload-section">
      <div className="section-header">
        <p>Language Information</p>
        <small>You can view or update your language information.</small>
      </div>
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="language_name">Language</label>
          <select
            id="language_name"
            name="language_name"
            value={newLanguage.language_name}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="Turkish">Turkish</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="level_id">Level</label>
          <select
            id="level_id"
            name="level_id"
            value={newLanguage.level_id}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level.level_id} value={level.level_id}>
                {level.level_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
          <div className="form-group">
            <label>Certificate</label>
            <DocumentUpload
              file={newLanguage.language_cert_file}
              setFile={handleDocumentChange}
              acceptedFileTypes=".pdf,.doc,.docx,.jpg,.png"
              maxFileSizeMB={5}
            />
          </div>
        </div>
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddLanguage}
          disabled={loading}
        >
          {loading
            ? isEditing
              ? "Saving..."
              : "Adding..."
            : isEditing
            ? "Save Language"
            : "Add Language"}
        </button>
      </div>
      </div>
      <div className="language-list">
        {languages.length === 0 ? (
          <p>No languages added yet.</p>
        ) : (
          <table className="application-table">
            <thead>
              <tr>
                <th>Language</th>
                <th>Level</th>
                <th>Certified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((language) => (
                <tr key={language.language_id}>
                  <td>{language.language_name}</td>
                  <td>{language.level_name}</td>
                  <td>{language.language_cert_file ? "Yes" : "-"}</td>
                  <td>
                    <div className="action-buttons">
                    <button
                      type="button"
                      className="btn btn-edit"
                      onClick={() => handleEdit(language.language_id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-delete"
                      onClick={() => handleDelete(language.language_id)}
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

export default FormTabLanguage;
