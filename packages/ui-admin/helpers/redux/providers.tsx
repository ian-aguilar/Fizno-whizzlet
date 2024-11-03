"use client";
import { store } from "@fizno/ui-core/src/redux/store";
import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";

interface ProvidersProps {}
function Providers({ children }: PropsWithChildren<ProvidersProps>) {
  return <Provider store={store}>{children}</Provider>;
}

export default Providers;
