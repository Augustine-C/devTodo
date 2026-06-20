import { useEffect, useState } from "react";
import "./App.css";
import { AppLayout } from "./components/AppLayout";
import { useStore } from "./store";

function App() {
  const init = useStore((s) => s.init);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    init().then(() => setReady(true)).catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        useStore.getState().openTaskForm();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "r") {
        e.preventDefault();
        useStore.getState().init();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-red-500 p-8 text-center">
        Failed to initialize database: {error}
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  return <AppLayout />;
}

export default App;
