import React, { useState, useEffect } from "react";
import DocumentUpload from "./DocumentUpload";

function FormTabAcademic({ academicData }) {
  const [exams, setExams] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [newExam, setNewExam] = useState({
    exam_type_id: "",
    exam_date: "",
    grade: "",
    exam_doc_file: null, // Will store full document object
  });
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (academicData) {
      setExams(academicData.studentExams || []);
      setExamTypes(academicData.examTypes || []);
    }
  }, [academicData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExam((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (fileData) => {
    setNewExam((prev) => ({
      ...prev,
      exam_doc_file: fileData
        ? {
            name: fileData.name,
            size: fileData.size,
            fileURL: fileData.fileURL,
            file_path: fileData.file_path,
            file: fileData.file,
            document_id: fileData.document_id,
          }
        : null,
    }));
  };

  const getExamTypeName = (typeId) => {
    const type = examTypes.find((t) => t.type_id === typeId);
    return type ? type.type_name : "";
  };

  const handleAddOrEditExam = async () => {
    setLoading(true);
    setMessage(null);
    setErrorMessage(null);

    if (!newExam.exam_type_id || !newExam.exam_date || !newExam.grade) {
      setErrorMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("exam_type_id", newExam.exam_type_id);
    formData.append("exam_date", newExam.exam_date);
    formData.append("grade", newExam.grade);

    if (newExam.exam_doc_file?.file) {
      formData.append("exam_doc_file", newExam.exam_doc_file.file);
    }

    try {
      const endpoint = isEditing
        ? "/wp-json/student-portal/v1/edit-exam"
        : "/wp-json/student-portal/v1/add-exam";

      const method = "POST";
      const token = localStorage.getItem("studentPortalToken");

      if (isEditing) {
        formData.append("exam_id", isEditing);
        if (newExam.exam_doc_file?.document_id) {
          formData.append("document_id", newExam.exam_doc_file.document_id);
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

      setExams((prev) => {
        const updated = isEditing
          ? prev.map((exam) =>
              exam.exam_id === isEditing
                ? {
                    ...exam,
                    ...newExam,
                    exam_id: isEditing,
                    exam_doc_file: data.file_path || exam.exam_doc_file,
                    type_name: getExamTypeName(newExam.exam_type_id),
                  }
                : exam
            )
          : [
              ...prev,
              {
                ...newExam,
                exam_id: data.exam_id,
                exam_doc_file: data.file_path,
                type_name: getExamTypeName(newExam.exam_type_id),
              },
            ];

        return updated;
      });

      setMessage(
        isEditing ? "Exam updated successfully!" : "Exam added successfully!"
      );
      setIsEditing(null);
      setNewExam({
        exam_type_id: "",
        exam_date: "",
        grade: "",
        exam_doc_file: null,
      });
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (examId) => {
    const examToEdit = exams.find((exam) => exam.exam_id === examId);
    if (examToEdit) {
      setIsEditing(examId);
      setNewExam({
        exam_type_id: examToEdit.exam_type_id,
        exam_date: examToEdit.exam_date,
        grade: examToEdit.grade,
        exam_doc_file: examToEdit.exam_doc_file
          ? {
              file_path: examToEdit.exam_doc_file,
              name: examToEdit.exam_doc_file.split("/").pop(),
              document_id: examToEdit.document_id,
            }
          : null,
      });
    }
  };

  const handleDelete = async (examId) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        const token = localStorage.getItem("studentPortalToken");
        const response = await fetch(
          `/wp-json/student-portal/v1/delete-exam?exam_id=${examId}`,
          { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Delete failed");

        setExams((prev) => prev.filter((exam) => exam.exam_id !== examId));
        setMessage("Exam deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="form-tab-academic">
      {message && <div className="message success">{message}</div>}
      {errorMessage && <div className="message error">{errorMessage}</div>}
      <div className="form-upload-section">
        <div className="section-header">
          <p>Academic Information</p>
          <small>You can view or update your contact information.</small>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="exam_type_id">Exam Type</label>
            <select
              id="exam_type_id"
              name="exam_type_id"
              value={newExam.exam_type_id}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Exam Type</option>
              {examTypes.map((type) => (
                <option key={type.type_id} value={type.type_id}>
                  {type.type_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="exam_date">Exam Date</label>
            <input
              type="date"
              id="exam_date"
              name="exam_date"
              value={newExam.exam_date}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="grade">Grade</label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={newExam.grade}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Exam Document</label>
            <DocumentUpload
              file={newExam.exam_doc_file}
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
            onClick={handleAddOrEditExam}
            disabled={loading}
          >
            {loading
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
              ? "Save Exam"
              : "Add Exam"}
          </button>
        </div>
      </div>

      <div className="exam-list">
        {exams.length === 0 ? (
          <p>No exams added yet.</p>
        ) : (
          <table className="application-table">
            <thead>
              <tr>
                <th>Exam Type</th>
                <th>Exam Date</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.exam_id}>
                  <td>{exam.type_name}</td>
                  <td>{exam.exam_date}</td>
                  <td>{exam.grade}</td>
                  <td>
                    <div className="action-buttons">
                    <button
                      type="button"
                      className="btn btn-edit"
                      onClick={() => handleEdit(exam.exam_id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-delete"
                      onClick={() => handleDelete(exam.exam_id)}
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

export default FormTabAcademic;
