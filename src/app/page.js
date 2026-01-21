"use client";
import { useState } from "react";
import axios from "axios";
import InfoData from "@/utils/data";

export default function Home() {
  const [mobile, setMobile] = useState("");
  const [students, setStudents] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
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
      setPdfUrl("");

      const res = await axios.post(
        "https://hallticketbackend.onrender.com/api/students/get-students-by-mobile",
        { mobile }
      );

      if (res.data.count === 1) {
        generateHallTicket(res.data.students[0].id);
      } else {
        setStudents(res.data.students);
      }

    } catch (error) {
      alert(error.response?.data?.message || "Server not responding");
    } finally {
      setLoading(false);
    }
  };

  /* ===== STEP 2: GENERATE HALL TICKET ===== */
  const generateHallTicket = async (studentId) => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://hallticketbackend.onrender.com/api/students/generate-hallticket",
        { studentId }
      );

      setPdfUrl(
        `https://hallticketbackend.onrender.com${res.data.pdfUrl}`
      );
    } catch {
      alert("Failed to generate hall ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-500 w-full min-h-screen flex flex-col items-center">

      {/* ===== HEADER (UNCHANGED) ===== */}
      <div className="w-full h-25 bg-gray-900/25 flex items-center justify-center pt-5">
        <div>
          <img src="/logo.png" alt="Logo" className="w-20 h-16 mr-2" />
        </div>
        <div>
          <div className="text-white text-xl">
            P.P SAVANI VIDHYAMANDIR
          </div>
          <div className="text-[0.5rem] text-white">
            AT POST KATHGADH VYARA, DIST. TAPI
          </div>
        </div>
      </div>

      {/* ===== FORM BOX ===== */}
      <div className="w-90 h-auto bg-gray-100 rounded-sm lg:w-125 flex flex-col items-center gap-5 p-5 shadow-lg mt-8">

        <span className="text-black font-bold text-2xl">
          GENERATE HALL TICKET
        </span>

        {/* MOBILE INPUT */}
        <input
          type="text"
          placeholder="Enter Register Phone No"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-56 border border-gray-950 px-2 text-black placeholder-gray-800"
        />

        <button
          onClick={checkMobile}
          disabled={loading}
          className="bg-blue-500 text-white px-5 py-2 rounded-sm"
        >
          {loading ? "Checking..." : "Proceed"}
        </button>

        {/* ===== MULTIPLE STUDENTS LIST ===== */}
        {students.length > 0 && (
          <div className="w-full flex flex-col items-center gap-2">
            <p className="font-semibold text-black">
              Select Your Name
            </p>

            {students.map((s, index) => (
              <button
                key={s.id}
                onClick={() => generateHallTicket(s.id)}
                className="w-56 border border-gray-800 text-left px-2 py-1 hover:bg-gray-200"
              >
                {index + 1}. {s.fullName}
              </button>
            ))}
          </div>
        )}

        {/* ===== PDF OPTIONS ===== */}
        {pdfUrl && (
          <div className="flex gap-4">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View PDF
            </a>

            <a
              href={pdfUrl}
              download
              className="text-green-600 underline"
            >
              Download
            </a>

            <button
              onClick={() => window.open(pdfUrl).print()}
              className="text-red-600 underline"
            >
              Print
            </button>
          </div>
        )}
      </div>

      {/* ===== HELP MESSAGE (UNCHANGED) ===== */}
      <p className="mt-4 text-sm text-white text-center px-4">
        {InfoData.English}
      </p>
      <p className="mt-2 text-sm text-white text-center px-4">
        {InfoData.Gujarati}
      </p>
      <p className="mt-2 text-sm text-white text-center px-4">
        {InfoData.Ticket}
      </p>
    </div>
  );
}
