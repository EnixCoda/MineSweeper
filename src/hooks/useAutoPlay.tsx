import { useToast, useUpdateEffect } from "@chakra-ui/react";
import * as React from "react";
import { Solution } from "../models/solver";

export function useAutoPlay(
  autoPlay: boolean,
  applySolutions: (solutions: Solution[]) => void,
  solutions: Solution[]
) {
  const toast = useToast();
  useUpdateEffect(() => {
    toast(
      autoPlay
        ? {
            position: "top",
            title: "Auto Play is ON",
            status: "success",
            duration: 2000,
          }
        : {
            position: "top",
            title: "Auto Play is OFF",
            status: "info",
            duration: 2000,
          }
    );
  }, [autoPlay]);

  React.useEffect(() => {
    if (autoPlay) {
      const timeout = setTimeout(() => applySolutions(solutions), 0 * 100);
      return () => clearTimeout(timeout);
    }
  }, [autoPlay, applySolutions, solutions]);
}
