import React, { useState } from "react";

const MailForm = ({ defaultEmail = "doibncm2003@gmail.com" }) => {
  const [email, setEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Tiêu đề */}
      <h1 className="font-lovehouse text-3xl font-semibold">Send Email</h1>

      {/* Form Gửi Email */}
      <fieldset className="p-4 border rounded-lg shadow-lg w-full">
        <legend className="font-semibold text-lg">📧 Điền thông tin Email:</legend>

        {/* Email */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Đến:</span>
          <input
            type="email"
            disabled
            className="w-full p-2 border rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {/* Tiêu đề */}
        <label className="block mt-3">
          <span className="text-gray-700 font-semibold">Tiêu đề:</span>
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>

        {/* Nội dung */}
        <label className="block mt-3">
          <span className="text-gray-700 font-semibold">Nội dung:</span>
          <textarea
            className="w-full p-2 border rounded mt-1"
            rows="4"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>

        {/* Nút Gửi */}
        <button
          onClick={handleSendEmail}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Gửi Email
        </button>
      </fieldset>
    </div>
  );
};

export default MailForm;
