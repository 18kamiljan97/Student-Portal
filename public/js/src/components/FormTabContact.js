import React, { useState, useEffect } from "react";

function FormTabContact({ contactData, studentId }) {
  const [formData, setFormData] = useState({
    contactEmail: "",
    contactPhone: "",
    contactFacebook: "",
    contactInstagram: "",
    contactLinkedIn: "",
    country: "",
    city: "",
    postcode: "",
    street: "",
    buildingNo: "",
    doorNo: "",
  });

  const [saving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Populate form with `contactData` when it changes
  useEffect(() => {
    console.log("personalData received in FormTabPersonal:", contactData);
    if (contactData) {
      setFormData({
        contactEmail: contactData.contactEmail || "",
        contactPhone: contactData.contactPhone || "",
        contactFacebook: contactData.contactFacebook || "",
        contactInstagram: contactData.contactInstagram || "",
        contactLinkedIn: contactData.contactLinkedIn || "",
        country: contactData.country || "",
        city: contactData.city || "",
        postcode: contactData.postcode || "",
        street: contactData.street || "",
        buildingNo: contactData.buildingNo || "",
        doorNo: contactData.doorNo || "",
      });
    }
  }, [contactData]);

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
    fetch("/wp-json/student-portal/v1/update-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("studentPortalToken")}`,
      },
      body: JSON.stringify({ ...formData, student_id: studentId }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update contact data.");
        return response.json();
      })
      .then(() => {
        setMessage("Contact details saved successfully!");
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Error updating contact data:", error);
        setMessage("");
        setErrorMessage("Error saving data");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div className="form-tab-contact">
      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="section-header">
        <p>Contact Information</p>
        <small>You can view or update your contact information.</small>
      </div>

      {contactData ? (
        <>
          <div className="form-section">
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>LinkedIn:</label>
              <input
                type="text"
                name="contactLinkedIn"
                value={formData.contactLinkedIn}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Facebook:</label>
              <input
                type="text"
                name="contactFacebook"
                value={formData.contactFacebook}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Instagram:</label>
              <input
                type="text"
                name="contactInstagram"
                value={formData.contactInstagram}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="section-header">
            <p>Adress Information</p>
            <small>You can view or update your adress information.</small>
          </div>
          <div className="form-section">
            <div className="form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Postal Code:</label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Street:</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Building Number:</label>
              <input
                type="text"
                name="buildingNo"
                value={formData.buildingNo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Door Number:</label>
              <input
                type="text"
                name="doorNo"
                value={formData.doorNo}
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
        <p>Loading contact data...</p>
      )}
    </div>
  );
}

export default FormTabContact;
