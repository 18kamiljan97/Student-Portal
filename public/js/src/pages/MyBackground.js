import React, { useState, useEffect } from "react";
import Tabs from "../components/Tabs";
import FormTabPersonal from "../components/FormTabPersonal";
import FormTabFamily from "../components/FormTabFamily";
import FormTabContact from "../components/FormTabContact";
import FormTabEducation from "../components/FormTabEducation";
import FormTabLanguage from "../components/FormTabLanguage";
import FormTabAcademic from "../components/FormTabAcademic";
import FormTabWorkExperience from "../components/FormTabWork";
import SkeletonLoader from "../components/SkeletonLoader";

function MyBackground({
    personalData,
    familyData,
    contactData,
    educationData,
    languageData,
    academicData,
    workExperienceData,
}) {
    return (
        <div className="my-background-page">
            <Tabs>
                <Tabs.TabPane label="Personal">
                    <FormTabPersonal personalData={personalData} />
                </Tabs.TabPane>
                <Tabs.TabPane label="Family">
                    <FormTabFamily familyData={familyData} />
                </Tabs.TabPane>
                <Tabs.TabPane label="Contact">
                    <FormTabContact contactData={contactData} />
                </Tabs.TabPane>
                <Tabs.TabPane label="Education">
                    <FormTabEducation educationData={educationData} />
                </Tabs.TabPane>
                <Tabs.TabPane label="Language">
                    <FormTabLanguage languageData={languageData} />
                </Tabs.TabPane>
                <Tabs.TabPane label="Academic Qualification">
                    <FormTabAcademic academicData={academicData} />
                </Tabs.TabPane>
                <Tabs.TabPane label="Work Experience">
                    <FormTabWorkExperience workExperienceData={workExperienceData} />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
}

export default MyBackground;
