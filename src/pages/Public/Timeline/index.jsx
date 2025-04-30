import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../utils";

export default function Timeline() {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const cached = sessionStorage.getItem("timelineData");
        const cacheTime = sessionStorage.getItem("timelineCacheTime");

        const now = Date.now();
        const maxAge = 5 * 60 * 1000; // ⏱ 5 phút

        if (cached && cacheTime && now - cacheTime < maxAge) {
          const data = JSON.parse(cached);
          if (Array.isArray(data)) {
            setTimelineData(data);
            setLoading(false);
            return;
          }
        }

        // Nếu không có cache hoặc đã cũ thì gọi API
        const res = await axios.get(API_URL.GET_TIMELINE);
        if (Array.isArray(res.data)) {
          setTimelineData(res.data);
          sessionStorage.setItem("timelineData", JSON.stringify(res.data));
          sessionStorage.setItem("timelineCacheTime", now.toString());
        } else {
          setTimelineData([]);
        }
      } catch (err) {
        console.error("Lỗi khi lấy timeline:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  // 👉 UI loading/error/no data
  if (loading) {
    return (
      <div className="w-full md:w-[90%] max-w-2xl mx-auto px-6 py-5">
        <div className="h-16"></div>
        <h1 className="text-3xl font-bold text-center mb-8">Lịch sử cập nhật</h1>
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          {[...Array(7)].map((_, index) => (
            <li key={index}>
              {index !== 0 && <hr />}
              <div className="timeline-middle">
                <div className="skeleton h-5 w-5 rounded-full bg-gray-300"></div>
              </div>
              <div className={`timeline-${index % 2 === 0 ? "start" : "end"} mb-10 md:text-${index % 2 === 0 ? "end" : "start"}`}>
                <div className="skeleton h-4 w-24 mb-2 bg-gray-300"></div>
                <div className="skeleton h-6 w-40 mb-2 bg-gray-300"></div>
                <div className="skeleton h-4 w-full bg-gray-300"></div>
              </div>
              <hr />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!timelineData.length) return <div className="text-center mt-10">Không có dữ liệu lịch sử.</div>;

  return (
    <div className="w-full md:w-[90%] max-w-2xl mx-auto px-6 py-5">
      <div className="h-16"></div>
      <h1 className="text-3xl font-bold text-center mb-8">Lịch sử cập nhật</h1>
      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
        {timelineData.map((update, index) => (
          <li key={update.id || index}>
            {index !== 0 && <hr />}
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className={`timeline-${index % 2 === 0 ? "start" : "end"} mb-10 md:text-${index % 2 === 0 ? "end" : "start"}`}>
              <time className="font-mono italic">{update.date}</time>
              <div className="text-lg font-black">{update.title}</div>
              <p className="whitespace-pre-line">{update.description}</p>
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
