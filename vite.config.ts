// TODO: This project uses @lovable.dev/vite-tanstack-config as a build dependency.
// To fully remove this dependency, migrate to a standard Vite configuration.
// The config provides: tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro,
// componentTagger, VITE_* env injection, @ path alias, React/TanStack dedupe,
// error logger plugins, and sandbox detection.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
