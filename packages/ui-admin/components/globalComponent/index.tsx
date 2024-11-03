"use client";
import { useAppSelector } from "@fizno/ui-core/src/redux/hooks";
import { globalCacheStateSelector } from "@fizno/ui-core/src/redux/slices/globaCache.slice";
import React from "react";
import AlertComponent from "../Alert";

const GlobalComponent = () => {
  // redux
  const { alertMessage } = useAppSelector(globalCacheStateSelector);

  return (
    <div className="relative">
      {alertMessage.open && (
        <AlertComponent
          message={alertMessage.message}
          severity={alertMessage.severity}
          open={alertMessage.open}
        />
      )}
    </div>
  );
};

export default GlobalComponent;
