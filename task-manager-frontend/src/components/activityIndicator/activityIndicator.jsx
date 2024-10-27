

import React from "react";
import { Bounce, Sentry, Spinner } from "react-activity";
import "react-activity/dist/library.css";

export default function ActivityIndicator(){
  return (
    <div style={{display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
        <Bounce color="#17A2B8" size={20} speed={1} animating={true}/>
    </div>
  )
};