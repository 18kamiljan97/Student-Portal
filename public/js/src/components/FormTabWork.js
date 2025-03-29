import React, { useState, useEffect } from "react";

function FormTabWorkExperience({ workExperienceData }) {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [newWork, setNewWork] = useState({
    work_type_id: "",
    company_name: "",
    position: "",
    country: "",
    start_date: "",
    end_date: "",
    is_present: false, // Checkbox for "Currently Working Here"
    documents: [], // Store multiple documents
  });
  const [isEditing, setIsEditing] = useState(null); // work_id or null
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Initialize from props
  useEffect(() => {
    if (workExperienceData) {
      setWorkExperiences(workExperienceData.studentWorkExperiences || []);
      setWorkTypes(workExperienceData.workTypes || []);
    }
  }, [workExperienceData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWork({ ...newWork, [name]: value });
  };

  // Handle checkbox change for "Currently Working Here"
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewWork({ ...newWork, [name]: checked });
  };

  // Helper function to get exam type name
  const getWorkTypeName = (typeId) => {
    const type = workTypes.find((t) => t.type_id === typeId);
    return type ? type.type_name : "";
  };

  const handleAddOrEditWork = async () => {
    setLoading(true);
    setMessage(null);

    // Validation
    if (
      !newWork.work_type_id ||
      !newWork.company_name ||
      !newWork.position ||
      !newWork.country ||
      !newWork.start_date
    ) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Date validation: End date must be after start date (unless is_present is true)
    if (
      !newWork.is_present &&
      newWork.end_date &&
      new Date(newWork.end_date) <= new Date(newWork.start_date)
    ) {
      alert("End date must be after start date.");
      setLoading(false);
      return;
    }

    // Prepare data for API (handle "Present" end date)
    const dataToSend = {
      ...newWork,
      end_date: newWork.is_present ? null : newWork.end_date, // Send null if is_present is true
    };

    // Remove is_present from the data sent to the API (it's only for frontend logic)
    delete dataToSend.is_present;

    try {
      const endpoint = isEditing
        ? "/wp-json/student-portal/v1/edit-work"
        : "/wp-json/student-portal/v1/add-work";
      const method = "POST";

      if (isEditing) {
        dataToSend.work_id = isEditing;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json", // Important for sending JSON
          Authorization: `Bearer ${localStorage.getItem("studentPortalToken")}`,
        },
        body: JSON.stringify(dataToSend), // Send data as JSON string
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }

      const data = await response.json();

      if (isEditing) {
        // Update existing work experience in state
        const updatedWorkExperiences = workExperiences.map((work) =>
          work.work_id === isEditing
            ? {
                ...work,
                ...dataToSend,
                work_id: isEditing,
                type_name: getWorkTypeName(newWork.work_type_id),
              }
            : work
        );
        setWorkExperiences(updatedWorkExperiences);
        setIsEditing(null);
        setMessage("Work experience updated successfully!"); // Set success message
      } else {
        // Add new work experience to state
        setWorkExperiences([
          ...workExperiences,
          {
            ...dataToSend,
            work_id: data.work_id, // Use ID from server
            type_name: getWorkTypeName(newWork.work_type_id),
          },
        ]);
        setMessage("Work experience added successfully!"); // Set success message
      }
    } catch (error) {
      console.error(
        isEditing
          ? "Error updating work experience:"
          : "Error adding work experience:",
        error
      );
      alert(error); //  display error
    } finally {
      setLoading(false);
      setNewWork({
        //clear the new work state.
        work_type_id: "",
        company_name: "",
        position: "",
        country: "",
        start_date: "",
        end_date: "",
        is_present: false,
      });
    }
  };

  const handleEdit = (workId) => {
    setMessage(null); // Clear previous messages
    const workToEdit = workExperiences.find((work) => work.work_id === workId);
    if (workToEdit) {
      setIsEditing(workId);
      setNewWork({
        work_type_id: workToEdit.work_type_id,
        company_name: workToEdit.company_name,
        position: workToEdit.position,
        country: workToEdit.country,
        start_date: workToEdit.start_date,
        end_date: workToEdit.end_date,
        is_present: workToEdit.end_date === null, // Set is_present based on end_date
      });
    }
  };

  const handleDelete = (workId) => {
    // Confirm deletion
    if (
      window.confirm("Are you sure you want to delete this work experience?")
    ) {
      const updatedWorkExperiences = workExperiences.filter(
        (work) => work.work_id !== workId
      );
      setWorkExperiences(updatedWorkExperiences);
      setMessage("Work Experience deleted successfully!"); //set success message
      // make an API call to delete from the backend.
    }
  };

  //Calculate duration
  const calculateDuration = (startDate, endDate) => {
    if (!startDate) {
      return "";
    }

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(); // Use current date if no end date

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

    return durationString.trim(); // Remove leading/trailing spaces
  };

  return (
    <div className="form-tab-work-experience">
      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="form-upload-section">
        <div className="section-header">
          <p>Work Experience Information</p>
          <small>You can view or update your work information.</small>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="work_type_id">Work Type</label>
            <select
              id="work_type_id"
              name="work_type_id"
              value={newWork.work_type_id}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Work Type</option>
              {workTypes.map((type) => (
                <option key={type.type_id} value={type.type_id}>
                  {type.type_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="company_name">Company Name</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={newWork.company_name}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={newWork.position}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={newWork.country}
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
            <label htmlFor="start_date">Start Date</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={newWork.start_date}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">End Date</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={newWork.end_date}
              onChange={handleInputChange}
              className="form-control"
              disabled={newWork.is_present} // Disable if "Currently Working Here" is checked
            />
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                name="is_present"
                checked={newWork.is_present}
                onChange={handleCheckboxChange}
              />
              <label>
                <p>Currently Working Here</p>
              </label>
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddOrEditWork}
            disabled={loading}
          >
            {loading
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
              ? "Save Experience"
              : "Add Experience"}
          </button>
        </div>
      </div>

      <div className="work-experience-list">
        {workExperiences.length === 0 ? (
          <p>No work experiences added yet.</p>
        ) : (
          <table className="application-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Work Type</th>
                <th>Country</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workExperiences.map((work) => (
                <tr key={work.work_id}>
                  <td>{work.company_name}</td>
                  <td>{work.position}</td>
                  <td>{work.type_name}</td>
                  <td>{work.country}</td>
                  <td>
                    {work.start_date && (
                      <span>
                        {work.is_present
                          ? `${work.start_date} - Present`
                          : `${work.start_date} - ${work.end_date}`}
                        ({calculateDuration(work.start_date, work.end_date)})
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn btn-edit"
                        onClick={() => handleEdit(work.work_id)}
                      >Edit</button>
                      <button
                        type="button"
                        className="btn btn-delete"
                        onClick={() => handleDelete(work.work_id)}
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

export default FormTabWorkExperience;
