import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoaderTest = () => {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Top Section - Title and Progress */}
      <div style={{ marginBottom: "10px" }}>
        <Skeleton height={24} width={200} /> {/* Title */}
      </div>
        <Skeleton height={10} width={150} style={{marginBottom: '25px'}}/> {/* progress text */}
      <Skeleton height={10}  style={{ marginBottom: "30px" }} /> {/* Progress Bar */}

      {/* Section Title */}
      <div style={{ marginBottom: "20px" }}>
        <Skeleton height={30} width={180} />
      </div>

      {/* Question and Options */}
      <div style={{ marginBottom: "15px" }}>
        <Skeleton height={20} width={300} /> {/* Question */}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Skeleton height={40} /> {/* Option 1 */}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Skeleton height={40} /> {/* Option 2 (Number) */}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Skeleton height={40} /> {/* Option 3 */}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Skeleton height={40} /> {/* Option 4 (Number) */}
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Skeleton height={40} /> {/* Option 5 */}
      </div>

       <Skeleton height={10}  style={{ marginBottom: "30px" }} /> {/* Progress Bar */}

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <Skeleton width={100} height={40} />
        <Skeleton width={100} height={40} />
      </div>

        {/* Tip Section */}
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa', // Light grey background, similar to the image
          borderRadius: '8px', // Rounded corners
          marginBottom: '20px', // Spacing below
        }}>
            <Skeleton height={20} width={50} style={{marginBottom: '5px'}}/>
            <Skeleton height={14}  />
             <Skeleton height={14} width={'80%'}/>
        </div>


      {/* Save and Continue */}
      <Skeleton height={20} width={150} />
    </div>
  );
};

export default SkeletonLoaderTest;