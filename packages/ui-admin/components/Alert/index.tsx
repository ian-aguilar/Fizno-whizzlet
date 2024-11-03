import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { closeSnackbar } from "@fizno/ui-core/src/redux/slices/globaCache.slice";
import { Alert } from "@mui/material";
import { useAppDispatch } from "@fizno/ui-core/src/redux/hooks";

interface AlertComponentI {
  message: string;
  severity: "success" | "error";
  open: boolean;
}

const AlertComponent = ({ message, severity, open }: AlertComponentI) => {
  const dispatch = useAppDispatch();

  const handleClose = (
    event: React.SyntheticEvent<any> | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeSnackbar());
  };
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AlertComponent;
