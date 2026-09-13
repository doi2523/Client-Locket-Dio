import React, { useEffect, useState } from "react";
import { Package, Eye, Download, Star, Sparkles } from "lucide-react";
import { getAllCollections } from "@/services";

export default function CollectionPage() {
  const [collections, setCollections] = useState([]);

  const categories = ["Tất cả", "Main", "Classic"];
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    const getCollection = async () => {
      try {
        const data = await getAllCollections();
        setCollections(data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      }
    };

    getCollection();
  }, []);

  const filteredCollections =
    selectedCategory === "Tất cả"
      ? collections
      : collections.filter((item) => item.category === selectedCategory);

  // const currentOrigin = "https://locket-dio.com";
  const currentOrigin = window.location.origin;

  const currentVersion = collections.find(
    (item) => item.url && item.url.includes(currentOrigin),
  );

  return (
    <div className="min-h-screen max-w-7xl bg-base-200 px-5 mx-auto py-6">
      {/* Header */}
      <div className="">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-base-100 rounded-lg">
            <Package className="w-6 h-6 text-base-content" />
          </div>
          <h1 className="text-3xl font-bold text-base-content">
            Thư viện Phiên bản
          </h1>
        </div>
        <p className="text-base-content/80 text-lg max-w-2xl">
          Khám phá các phiên bản khác nhau của website, mỗi phiên bản mang phong
          cách và trải nghiệm riêng biệt.
        </p>
      </div>
      {/* Current Version */}
      {currentVersion && (
        <div className="">
          <div className="mt-6">
            <div className="inline-flex items-center gap-4 bg-base-100 border border-base-300 rounded-2xl px-5 py-3 shadow-sm">
              <div className="relative">
                <img
                  src={currentVersion.image}
                  alt={currentVersion.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow">
                  LIVE
                </span>
              </div>

              <div>
                <p className="text-xs text-base-content/60">Bạn đang sử dụng</p>
                <p className="font-semibold text-base-content">
                  {currentVersion.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-6">
        {/* Filter với design mới */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold">Danh mục</h2>
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-primary text-primary-content shadow-md"
                    : "bg-base-100 text-base-content/80 border border-base-300 hover:bg-base-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Collections Grid */}
        {filteredCollections.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sh">
            {filteredCollections.map((item) => (
              <div
                key={item.id}
                className="group relative bg-base-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Popular Badge */}
                {item.is_popular && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Popular
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {item.category}
                  </span>
                </div>

                {/* Image Section với gradient overlay */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-base-content/70 leading-relaxed line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-base-300">
                    <div className="flex items-center gap-1.5 text-sm">
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-semibold text-gray-700">
                          {item.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                        <Download className="w-3.5 h-3.5 text-gray-600 mr-1" />
                        <span className="font-semibold text-gray-700">
                          {item.downloads}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
                        item.active
                          ? "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        item.active
                          ? window.open(item.url, "_blank")
                          : alert("Tính năng đang phát triển!")
                      }
                      disabled={!item.active}
                    >
                      {item.active ? "Cài đặt" : "Sắp ra mắt"}
                    </button>

                    <button className="p-2.5 bg-gray-50 text-gray-700 btn btn-circle hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 transform hover:scale-105">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <div className="inline-block p-5 bg-gray-50 rounded-full mb-4">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Chưa có phiên bản nào
            </h3>
            <p className="text-gray-500">
              Dữ liệu đang được cập nhật, vui lòng quay lại sau.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
