import { useState, useEffect } from "react";
import { MessageCircle, X, Handshake } from "lucide-react";
import { useFeatureVisible } from "@/hooks/useFeature";
import { API_URL } from "@/utils";

const ContactSupportButton = () => {
  const isSupportVisible = useFeatureVisible("hidden_support");
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSupportVisible === false) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSupportVisible]);

  // ✅ Gọi API contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL.GET_COLLABORATORS);
        const data = await res.json();
        setContacts(data.contacts || []);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (showModal) {
      fetchContacts();
    }
  }, [showModal]);

  const handleZaloCall = () => {
    if (contacts.length > 0 && contacts[0].phone) {
      window.open(`https://zalo.me/${contacts[0].phone}`, "_blank");
    }
  };

  const handleInstagramOpen = () => {
    if (contacts.length > 0 && contacts[0].instagram) {
      window.open(`https://instagram.com/${contacts[0].instagram}`, "_blank");
    }
  };

  const handleZaloCommunity = () => {
    if (contacts.length > 0 && contacts[0].zalo_links?.length > 0) {
      window.open(`${contacts[0].zalo_links}`, "_blank");
    }
  };

  // Lock scroll when modal open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  return (
    <>
      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative bounce-y">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3.5 shadow-lg transition-transform duration-200 hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Badge đỏ hiển thị số tin nhắn */}
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
            3
          </span>
        </div>
      </div>

      {/* Support Modal */}
      <div
        className={`fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          showModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowModal(false)}
      >
        <div
          className={`relative w-full max-w-md mx-4 bg-base-200 rounded-2xl shadow-xl transition-transform duration-300 ${
            showModal ? "scale-100" : "scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative flex flex-col items-center p-5 border-b border-base-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-base-300"
            >
              <X className="w-5 h-5 text-base-content" />
            </button>

            {/* Partnership Display */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex flex-col items-center">
                <img
                  src="/apple-touch-icon.png"
                  alt="Locket Dio"
                  className="w-12 h-12 rounded-xl border border-gray-200"
                />
                <span className="text-xs text-base-content mt-1 font-semibold">
                  Locket Dio
                </span>
              </div>

              <Handshake className="w-6 h-6 text-gray-500" />

              <div className="flex flex-col items-center">
                {loading ? (
                  <div className="w-12 h-12 rounded-xl bg-gray-300 animate-pulse" />
                ) : (
                  <img
                    src={contacts[0]?.logo_url}
                    alt="Onion"
                    className="w-12 h-12 rounded-xl border border-gray-200"
                  />
                )}
                <span className="text-xs text-base-content mt-1 font-semibold">
                  Onion
                </span>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-base-content">
              Hỗ Trợ & Dịch Vụ
            </h2>
          </div>

          {/* Content */}
          <div className="p-5">
            {loading ? (
              // 🔹 Skeleton khi loading
              <div className="space-y-4">
                <div className="h-20 bg-gray-300 rounded-lg animate-pulse" />
                <div className="h-16 bg-gray-300 rounded-lg animate-pulse" />
                <div className="h-10 bg-gray-300 rounded-lg animate-pulse" />
              </div>
            ) : (
              <>
                {/* Services */}
                <div className="bg-base-100 rounded-lg p-4 mb-4">
                  <div className="text-sm text-base-content space-y-1">
                    <p>🔹 Dịch vụ MXH (FB, IG, TikTok)</p>
                    <p>🔹 Up Locket Gold & Premium Apps</p>
                    <p>🔹 Netflix, YouTube, Spotify...</p>
                  </div>
                  <div className="text-center mt-3 text-blue-600 font-medium text-sm">
                    ⭐ Uy tín • Nhanh chóng • Giá tốt ⭐
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-base-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={contacts[0]?.logo_url}
                      alt="Onion"
                      className="w-12 h-12 rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-base-content">Onion</h3>
                      <p className="text-xs text-base-content/70">
                        {contacts[0]?.role}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleZaloCall}
                      className="w-full text-left text-green-600 hover:text-green-700 font-medium"
                    >
                      📞 Zalo/SĐT:{" "}
                      <span className="underline">{contacts[0]?.phone}</span>
                    </button>
                    <button
                      onClick={handleInstagramOpen}
                      className="w-full text-left text-pink-600 hover:text-pink-700 font-medium"
                    >
                      📷 IG:{" "}
                      <span className="underline">
                        @{contacts[0]?.instagram}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Community */}
                <div className="text-center">
                  <button
                    onClick={handleZaloCommunity}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    🌐 Tham gia cộng đồng Zalo
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactSupportButton;
