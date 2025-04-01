import { useState } from "react";
import axios from "axios";

const SERVER_URL = "http://localhost:5005"; // Thay bằng URL của bạn

export default function UploadForm() {
    const [file, setFile] = useState(null);
    const [type, setType] = useState("video-crop");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [resultUrl, setResultUrl] = useState(""); // Lưu URL file sau xử lý

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Vui lòng chọn file!");
    
        const formData = new FormData();
        formData.append("video", file);  // Tên "file" phải trùng với tên bạn gửi trong FormData

        let endpoint = "";
        if (type === "video-crop") endpoint = "/video/cropvideo";
        if (type === "video-compress") endpoint = "/video/compress";
        if (type === "image-crop") endpoint = "/image/crop";
    
        setLoading(true);
        setMessage("");
        setResultUrl("");

        try {
            const res = await axios.post(`${SERVER_URL}${endpoint}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(res); // Kiểm tra phản hồi từ server

            if (res.data && res.data.videoUrl) {
                setMessage("Xử lý thành công!");
                setResultUrl(`${SERVER_URL}${res.data.videoUrl}`); // Đảm bảo trả về URL video
            } else {
                setMessage("Lỗi: Không nhận được URL video!");
            }
        } catch (error) {
            setMessage("Lỗi xử lý file: " + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Upload File</h2>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
            <select onChange={(e) => setType(e.target.value)} className="mb-4 p-2 border rounded">
                <option value="video-crop">Cắt Video Thành Vuông</option>
                <option value="video-compress">Nén Video</option>
                <option value="image-crop">Cắt Ảnh Thành Vuông</option>
            </select>
            <button
                onClick={handleUpload}
                className="bg-blue-500 text-white p-2 rounded"
                disabled={loading}
            >
                {loading ? "Đang xử lý..." : "Upload & Xử lý"}
            </button>
            <div className="mt-4">{message}</div>

            {/* Hiển thị kết quả */}
            {resultUrl && (
                <div className="mt-4">
                    <h3 className="font-bold">Kết quả:</h3>
                    {type.includes("video") ? (
                        <video controls src={resultUrl} className="mt-2 w-64 border rounded-lg"></video>
                    ) : (
                        <img src={resultUrl} alt="Processed Image" className="mt-2 w-64 border rounded-lg" />
                    )}
                </div>
            )}
        </div>
    );
}
