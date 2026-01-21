"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [mobile, setMobile] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== STEP 1: CHECK MOBILE ===== */
  const checkMobile = async () => {
    if (!mobile) return alert("Enter mobile number");

    try {
      setLoading(true);
      const res = await axios.post(
        "https://hallticketbackend.onrender.com/api/students/get-students-by-mobile",
        { mobile }
      );

      if (res.data.count === 1) {
        generateHallTicket(res.data.students[0].id);
      } else {
        setStudents(res.data.students);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ===== STEP 2: GENERATE PDF ===== */
  const generateHallTicket = async (studentId) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://hallticketbackend.onrender.com/api/students/generate-hallticket",
        { studentId }
      );

      setPdfUrl(`https://hallticketbackend.onrender.com${res.data.pdfUrl}`);
      setSelectedStudent(studentId);
    } catch {
      alert("Failed to generate hall ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-500 flex flex-col items-center p-5">

      <div className="bg-white p-6 rounded w-80 text-center space-y-4">

        <h2 className="text-xl font-bold">Enter Mobile Number</h2>

        <input
          className="border w-full p-2"
          placeholder="Registered Mobile Number"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
        />

        <button
          onClick={checkMobile}
          className="bg-blue-600 text-white px-4 py-2 w-full"
          disabled={loading}
        >
          {loading ? "Checking..." : "Proceed"}
        </button>

        {/* ===== MULTIPLE STUDENTS ===== */}
        {students.length > 0 && (
          <div className="text-left">
            <p className="font-semibold mt-3">Select Your Name:</p>
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => generateHallTicket(s.id)}
                className="block w-full text-left border px-2 py-1 mt-1 hover:bg-gray-100"
              >
                {s.fullName}
              </button>
            ))}
          </div>
        )}

        {/* ===== PDF OPTIONS ===== */}
        {pdfUrl && (
          <div className="flex flex-col gap-2 mt-4">
            <a href={pdfUrl} target="_blank" className="text-blue-600 underline">
              View Hall Ticket
            </a>
            <a href={pdfUrl} download className="text-green-600 underline">
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
    </div>
  );
}
