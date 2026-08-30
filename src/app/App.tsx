import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { router } from "@/app/router";

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            classNames: {
              toast: "bg-ink text-paper border border-paper/10",
              title: "text-paper font-medium",
              description: "text-paper/70",
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
