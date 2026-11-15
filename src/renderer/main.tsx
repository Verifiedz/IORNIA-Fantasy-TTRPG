import { createRoot } from "react-dom/client";
import "./design/tokens/index.css";
import { Root } from "./shell/Root";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(<Root />);
