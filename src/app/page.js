"use client";
import { useState } from "react";
import axios from "axios";
import InfoData from "@/utils/data";

export default function Home() {
  const [mobile, setMobile] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== STEP 1: CHECK MOBILE ===== */
  const checkMobile = async () => {
    if (!mobile) {
      alert("Please enter registered mobile number");
      return;
    }

    try {
      setLoading(true);
      setStudents([]);
      setSelectedStudentId(null);
      setPdfBlobUrl("");

      const res = await axios.post(
        "https://hallticketbackend.onrender.com/api/students/get-students-by-mobile",
        { mobile }
      );

      setStudents(res.data.students);

      // single student → auto select (but NO pdf open)
      if (res.data.count === 1) {
        setSelectedStudentId(res.data.students[0].id);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Server not responding");
    } finally {
      setLoading(false);
    }
  };

  /* ===== STEP 2: GENERATE PDF (ON BUTTON CLICK) ===== */
  const generatePdf = async (action) => {
    if (!selectedStudentId) {
      alert("Please select student first");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://hallticketbackend.onrender.com/api/students/generate-hallticket",
        { studentId: selectedStudentId },
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);

      if (action === "view") {
        window.open(url, "_blank");
      }

      if (action === "print") {
        const win = window.open(url);
        win.onload = () => win.print();
      }

      if (action === "download") {
        const a = document.createElement("a");
        a.href = url;
        a.download = "hallticket.pdf";
        a.click();
      }

    } catch {
      alert("Failed to generate hall ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-500 w-full min-h-screen flex flex-col items-center">

      {/* ===== HEADER ===== */}
      <div className="w-full h-25 bg-gray-900/25 flex items-center justify-center pt-5">
        <img src="/logo.png" alt="Logo" className="w-20 h-16 mr-2" />
        <div>
          <div className="text-white text-xl">P.P SAVANI VIDHYAMANDIR</div>
          <div className="text-[0.5rem] text-white">
            AT POST KATHGADH VYARA, DIST. TAPI
          </div>
        </div>
      </div>

      {/* ===== FORM ===== */}
      <div className="w-90 bg-gray-100 rounded-sm lg:w-125 flex flex-col items-center gap-5 p-5 shadow-lg mt-8">

        <span className="text-black font-bold text-2xl">
          GENERATE HALL TICKET
        </span>

        <input
          type="text"
          placeholder="Enter Register Phone No"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-56 border border-gray-950 px-2 text-black"
        />

        <button
          onClick={checkMobile}
          disabled={loading}
          className="bg-blue-500 text-white px-5 py-2 rounded-sm"
        >
          {loading ? "Generating..." : "Submit"}
        </button>

        {/* ===== STUDENT LIST ===== */}
        {students.length > 1 && (
          <div className="w-full flex flex-col gap-2 items-center">
            <p className="font-semibold text-black">Select Your Name</p>

            {students.map((s, index) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedStudentId(s.id);
                  setPdfBlobUrl("");
                }}
                className={`w-56 border px-2 py-1 text-left ${selectedStudentId === s.id
                    ? "bg-blue-200 border-blue-600"
                    : "border-gray-800"
                  }`}
              >
                {index + 1}. {s.fullName}
              </button>
            ))}
          </div>
        )}

        {/* ===== PDF ACTION BUTTONS ===== */}
        {selectedStudentId && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => generatePdf("view")}
              className="text-blue-600 underline"
            >
              View PDF
            </button>

            <button
              onClick={() => generatePdf("download")}
              className="text-green-600 underline"
            >
              Download
            </button>

            <button
              onClick={() => generatePdf("print")}
              className="text-red-600 underline"
            >
              Print
            </button>
          </div>
        )}
      </div>

      {/* ===== HELP TEXT ===== */}
      <p className="mt-4 text-sm text-white text-center px-4">
        {InfoData.English}
      </p>
      <p className="mt-2 text-sm text-white text-center px-4">
        {InfoData.Gujarati}
      </p>
      <p className="mt-2 text-sm text-white text-center px-4">
        {InfoData.Ticket}
      </p>
      <footer className="w-full mt-auto bg-gray-900/60 text-white/50 text-center py-3 text-xs">
        <p>© 2026 VayuSoftware.</p>
        <p>
          Developed by VayuSoftware, Web Development Company 
        </p>
        <p>Contact: Harendrasinh:+91-9867775626</p>
      </footer>
    </div>
  );
}
