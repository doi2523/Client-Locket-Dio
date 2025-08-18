import React, { useState } from "react";

const MailForm = ({ defaultEmail = "doibncm2003@gmail.com" }) => {
  const [email] = useState(defaultEmail);
  const [subject] = useState("Góp ý về website Locket Dio");
  const [body, setBody] = useState("");

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="w-full mt-2">
      {/* Form Gửi Email */}
      <fieldset className="p-4 border rounded-lg shadow-lg w-full bg-base-100">
        <legend className="font-semibold text-lg">
          📧 Gửi góp ý cho Locket Dio
        </legend>

        {/* Email (readonly text) */}
        <p className="">
          <span className="font-semibold">Đến:</span>{" "}
          <span className="text-primary">{email}</span>
        </p>

        {/* Subject (readonly text) */}
        <p className="mt-2">
          <span className="font-semibold">Tiêu đề:</span>{" "}
          <span className="text-primary">{subject}</span>
        </p>

        {/* Nội dung */}
        <label className="block mt-4">
          <span className="font-semibold">Nội dung:</span>
          <textarea
            className="w-full p-2 border rounded mt-1 textarea"
            rows="4"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Nhập nội dung góp ý..."
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
