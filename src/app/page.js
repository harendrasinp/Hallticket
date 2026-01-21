{/* ===== PDF OPTIONS ===== */}
{pdfUrl && (
  <div className="flex gap-4">
    <a
      href={pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
      onClick={() => setPdfUrl("")} // hide options after clicking view
    >
      View PDF
    </a>

    <a
      href={pdfUrl}
      download
      className="text-green-600 underline"
      onClick={() => setPdfUrl("")} // hide options after clicking download
    >
      Download
    </a>

    <button
      onClick={() => {
        window.open(pdfUrl).print();
        setPdfUrl(""); // hide options after clicking print
      }}
      className="text-red-600 underline"
    >
      Print
    </button>
  </div>
)}
