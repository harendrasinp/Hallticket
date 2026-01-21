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
        { studentId },
        { responseType: "blob" }
      );

      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);

      setPdfUrl(url);              // options ke liye
      window.open(url, "_blank");  // new tab open

    } catch (err) {
      alert("Failed to generate hall ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-500 dark:bg-gray-900 w-full min-h-screen flex flex-col items-center">

      {/* ===== HEADER ===== */}
      <div className="w-full h-25 bg-gray-900/40 flex items-center justify-center pt-5">
        <img src="/logo.png" alt="Logo" className="w-20 h-16 mr-2" />
        <div>
          <div className="text-white text-xl">
            P.P SAVANI VIDHYAMANDIR
          </div>
          <div className="text-[0.6rem] text-white">
            AT POST KATHGADH VYARA, DIST. TAPI
          </div>
        </div>
      </div>

      {/* ===== FORM BOX ===== */}
      <div className="w-90 bg-gray-100 dark:bg-gray-800 rounded-sm lg:w-125 flex flex-col items-center gap-5 p-5 shadow-lg mt-8">

        <span className="text-black dark:text-white font-bold text-2xl">
          GENERATE HALL TICKET
        </span>

        {/* MOBILE INPUT */}
        <input
          type="text"
          placeholder="Enter Register Phone No"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-56 border border-gray-900 px-2 py-1 text-black dark:text-white dark:bg-gray-700 placeholder-gray-600 dark:placeholder-gray-300"
        />

        <button
          onClick={checkMobile}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-sm"
        >
          {loading ? "Processing..." : "Submit"}
        </button>

        {/* ===== MULTIPLE STUDENTS LIST ===== */}
        {students.length > 0 && (
          <div className="w-full flex flex-col items-center gap-2">
            <p className="font-semibold text-black dark:text-white">
              Select Your Name
            </p>

            {students.map((s, index) => (
              <button
                key={s.id}
                onClick={() => generateHallTicket(s.id)}
                className="w-56 border border-gray-800 dark:border-gray-400 text-left px-2 py-1 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {index + 1}. {s.fullName}
              </button>
            ))}
          </div>
        )}

        {/* ===== PDF OPTIONS ===== */}
        {pdfUrl && (
          <div className="flex gap-6 mt-4">

            <a
              href={pdfUrl}
              target="_blank"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              View PDF
            </a>

            <a
              href={pdfUrl}
              download
              className="text-green-600 dark:text-green-400 underline"
            >
              Download
            </a>

            <button
              onClick={() => {
                const win = window.open(pdfUrl);
                win.onload = () => win.print();
              }}
              className="text-red-600 dark:text-red-400 underline"
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
    </div>
  );
}
