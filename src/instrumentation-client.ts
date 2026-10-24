// Next.js 16 Client Instrumentation (instrumentation-client.ts)
try {
  if (typeof performance !== "undefined" && performance.mark) {
    performance.mark("exam-blog-app-init");
  }
} catch {
  // Ignore performance mark errors in restricted environments
}

export function onRouterTransitionStart(
  url: string,
  navigationType: "push" | "replace" | "traverse"
) {
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("nextjs:router-transition", {
          detail: {
            url,
            navigationType,
            timestamp: Date.now(),
          },
        })
      );
    }
  } catch {
    // Ignore custom event dispatch errors
  }
}
