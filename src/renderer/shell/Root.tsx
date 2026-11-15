import { useState } from "react";
import { LaunchSequence } from "./LaunchSequence";
import { App } from "./App";

export function Root() {
  const [launched, setLaunched] = useState(false);

  if (!launched) {
    return <LaunchSequence onComplete={() => setLaunched(true)} />;
  }

  return <App />;
}
