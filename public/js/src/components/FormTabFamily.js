import React, { useState, useEffect } from "react";

function FormTabFamily({ familyData, studentId }) {
  // ✅ Initialize form state with passed `familyData`
  const [formData, setFormData] = useState({
    fatherName: "",
    fatherAlive: "1",
    fatherOccupation: "",
    motherName: "",
    motherAlive: "1",
    motherOccupation: "",
    numberOfSiblings: "",
  });

  const [saving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Populate form with `familyData` when it changes
  useEffect(() => {
    if (familyData) {
      setFormData({
        fatherName: familyData.fatherName || "",
        motherName: familyData.motherName || "",
        numberOfSiblings: String(familyData.numberOfSiblings || ""),
        fatherAlive: String(familyData.fatherAlive || "1"),
        motherAlive: String(familyData.motherAlive || "1"),
        fatherOccupation: familyData.fatherOccupation || "",
        motherOccupation: familyData.motherOccupation || "",
      });
    }
  }, [familyData]); // Runs when `familyData` is updated

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ Handle form submission (saving)
  const handleSave = () => {
    setIsSaving(true);
    fetch("/wp-json/student-portal/v1/update-family", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("studentPortalToken")}`,
      },
      body: JSON.stringify({ ...formData, student_id: studentId }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update family data.");
        return response.json();
      })
      .then(() => {
        setMessage("Family details saved successfully!");
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Error updating family data:", error);
        setMessage("");
        setErrorMessage("Error saving data");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div className="form-tab-family">
      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="section-header">
        <p>Family Information</p>
        <small>You can view or update your family information.</small>
      </div>

      {familyData ? (
        <>
          <div className="form-section">
            <div className="form-group">
              <label>Father's Name:</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Is Father Alive?</label>
              <select
                name="fatherAlive"
                value={formData.fatherAlive}
                onChange={handleChange}
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <div className="form-group">
              <label>Father's Occupation:</label>
              <input
                type="text"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Mother's Name:</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Is Mother Alive?</label>
              <select
                name="motherAlive"
                value={formData.motherAlive}
                onChange={handleChange}
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mother's Occupation:</label>
              <input
                type="text"
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Number of Siblings:</label>
              <input
                type="number"
                name="numberOfSiblings"
                value={formData.numberOfSiblings}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </>
      ) : (
        <p>Loading family data...</p>
      )}
    </div>
  );
}

export default FormTabFamily;
