"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateHallTicket = async () => {
    if (!fullName || !mobile) {
      alert("Please enter name and mobile number");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://hallticketbackend.onrender.com/api/students/generate-hallticket",
        { fullName, mobile }
      );

      setPdfUrl(
        `https://hallticketbackend.onrender.com${res.data.pdfUrl}`
      );
    } catch (error) {
      alert(
        error.response?.data?.message || "Server not responding"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-500 w-full h-screen flex flex-col items-center">

      {/* HEADER */}
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

      {/* FORM BOX */}
      <div className="w-90 h-80 bg-gray-100 rounded-sm lg:w-125 flex flex-col items-center justify-center gap-5 p-5 shadow-lg mt-10">

        <span className="text-black font-bold text-2xl">
          STUDENT DETAIL
        </span>

        <input
          type="text"
          placeholder="Enter Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value.toUpperCase())}
          className="w-56 border border-gray-950 px-2 text-black placeholder-gray-800"
        />

        <input
          type="text"
          placeholder="Enter Register Phone No"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-56 border border-gray-950 px-2 text-black placeholder-gray-800"
        />

        <button
          onClick={generateHallTicket}
          disabled={loading}
          className="bg-blue-500 text-white px-5 py-2 rounded-sm"
        >
          {loading ? "Generating..." : "Generate Hall Ticket"}
        </button>

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

      {/* HELP MESSAGE (OUTSIDE FORM BOX) */}
      <p className="mt-4 text-sm text-white text-center px-4">
        In case of any issue while generating the hall ticket, please contact the provided helpline number for assistance.
        9638611000
      </p>
      <p className="mt-2 text-sm text-white text-center px-4">
        હોલ ટિકિટ જનરેટ કરતી વખતે કોઈપણ પ્રકારની મુશ્કેલી અથવા ત્રુટિ થાય તો કૃપા કરીને આપેલ હેલ્પલાઇન નંબર પર સંપર્ક કરી સહાય પ્રાપ્ત કરો.
        હેલ્પલાઇન નંબર: 9638611000
      </p>
      <p className="mt-2 text-sm text-white text-center px-4">
        જો સંપૂર્ણ નામ દાખલ કરવા છતાં હોલ ટિકિટ જનરેટ ન થાય, તો કૃપા કરીને નીચે આપેલ વિકલ્પોમાંથી કોઈ એક રીતથી નામ દાખલ કરીને ફરી પ્રયાસ કરો:
        <div class="flex flex-col justify-center mt-3">
          <div className="flex flex-col justify-start">
            <div>1.HAREN</div>
            <div>2.HAREN PARMAR</div>
            <div>3.PARMAR HAREN</div>
            <div>3.PARMAR HAREN RAJENDRASINH</div>
          </div>
        </div>
      </p>

    </div>
  );
}
