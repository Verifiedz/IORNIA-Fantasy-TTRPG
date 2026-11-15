import { useEffect, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerSrc;

// View-only, per CLAUDE.md's PDF rule — this never writes back to the
// file, it just renders the first page of the Canva+GCS export untouched.
export function PdfView({ path }: { path: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const doc = await getDocument({ url: `iornia://${path}` }).promise;
        const page = await doc.getPage(1);
        const viewport = page.getViewport({ scale: 1.25 });
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, viewport }).promise;
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [path]);

  if (error) {
    return (
      <p className="font-reading text-ember-bright">
        Could not load the PDF: {error}
      </p>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full rounded border border-gold/30 bg-white"
    />
  );
}
