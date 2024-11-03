import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "@fizno/ui-core/src/redux/hooks";
import {
  globalCacheStateSelector,
  setAlertMessage,
} from "@fizno/ui-core/src/redux/slices/globaCache.slice";

const GlobalProvider = () => {
  /**
   * redux
   */
  const dispatch = useAppDispatch();
  const { alertMessage } = useAppSelector(globalCacheStateSelector);

  return (
    <div>
      <Snackbar
        open={alertMessage.open}
        autoHideDuration={6000}
        onClose={() =>
          dispatch(
            setAlertMessage({ open: false, message: "", severity: "error" }),
          )
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() =>
            dispatch(
              setAlertMessage({ open: false, message: "", severity: "error" }),
            )
          }
          severity={alertMessage.severity}
          sx={{ width: "100%" }}
        >
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GlobalProvider;
