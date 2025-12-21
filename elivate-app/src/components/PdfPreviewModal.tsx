"use client";

import { useEffect, useState, type ReactElement } from "react";
import { pdf, type DocumentProps } from "@react-pdf/renderer";

type PdfPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  pdfDocument: ReactElement<DocumentProps> | null;
  title: string;
};

export function PdfPreviewModal({
  isOpen,
  onClose,
  onDownload,
  pdfDocument,
  title,
}: PdfPreviewModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    if (isOpen && pdfDocument) {
      setIsLoading(true);
      setPdfUrl(null);
      setError(null);

      pdf(pdfDocument)
        .toBlob()
        .then((blob) => {
          objectUrl = URL.createObjectURL(blob);
          setPdfUrl(objectUrl + "#view=FitH");
          setIsLoading(false);
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to generate PDF preview:", err);
          setIsLoading(false);
          setPdfUrl(null);
          setError(err instanceof Error ? err.message : "Failed to generate PDF");
        });
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isOpen, pdfDocument]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close preview"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-muted">Generating preview...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <svg
                className="w-16 h-16 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">Failed to load preview</p>
                <p className="text-sm text-muted mt-2">{error}</p>
                <p className="text-xs text-muted mt-4">You can still download the PDF</p>
              </div>
            </div>
          ) : pdfUrl ? (
            <object
              data={pdfUrl}
              type="application/pdf"
              className="w-full h-full"
              aria-label="PDF Preview"
            >
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
              >
                <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
                  <p className="text-lg font-medium text-gray-700">
                    Your browser doesn&apos;t support PDF preview
                  </p>
                  <p className="text-sm text-muted">
                    Click the Download button below to view the PDF
                  </p>
                </div>
              </iframe>
            </object>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDownload();
              onClose();
            }}
            className="px-5 py-2.5 text-sm font-medium text-white bg-brand hover:bg-brand-strong rounded-xl transition-colors shadow-sm"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
