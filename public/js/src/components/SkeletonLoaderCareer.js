import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoaderCareer = () => {
  return (
    <div style={{ 
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.05)",
     }}>
      {/* Skeleton for Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <Skeleton width={200} height={40} />
      </div>

      {/* Skeleton for Form Fields */}
      <div>
        {/* Contact Information Section */}
        <h3 style={{ marginBottom: "10px" }}>
          <Skeleton height={20} width={150} />
        </h3>
        <p style={{ marginBottom: "15px" }}>
          <Skeleton height={10} width={250} />
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>

            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />

        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px"}}>
           <Skeleton height={40} />
           <Skeleton height={40} />
        </div>



        {/* Residential Address Section */}
        <h3 style={{ marginTop: "25px", marginBottom: "10px" }}>
          <Skeleton height={20} width={150} />
        </h3>
        <p style={{ marginBottom: "15px" }}>
          <Skeleton height={10} width={250} />
        </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <Skeleton height={40}  />
            <Skeleton height={40}  />
            <Skeleton height={40}  />
            </div>
            <div style={{marginTop: '15px'}}>
            <Skeleton height={40} />
            </div>


        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px" }}>
           <Skeleton height={40} />
           <Skeleton height={40} />
        </div>

        <div style={{marginTop: "20px", textAlign: 'right'}}>
            <Skeleton height={40} width={100} />
        </div>

      </div>
    </div>
  );
};

export default SkeletonLoaderCareer;