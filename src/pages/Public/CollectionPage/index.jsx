import React, { useEffect, useState } from "react";
import { Package, Eye, Download, Star } from "lucide-react";
import { API_URL } from "@/utils";

export default function CollectionPage() {
  const [collections, setCollections] = useState([]);

  const categories = ["Tất cả", "Classic"];
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    fetch(API_URL.GET_COLLECTIONS)
      .then((res) => res.json())
      .then((data) => setCollections(data))
      .catch((err) => console.error("Lỗi tải dữ liệu:", err));
  }, []);

  const filteredCollections =
    selectedCategory === "Tất cả"
      ? collections
      : collections.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="border-b border-base-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-base-100 rounded-lg">
              <Package className="w-6 h-6 text-base-content" />
            </div>
            <h1 className="text-3xl font-bold text-base-content">
              Thư viện Phiên bản
            </h1>
          </div>
          <p className="text-base-content/80 text-lg max-w-2xl">
            Khám phá các phiên bản khác nhau của website, mỗi phiên bản mang
            phong cách và trải nghiệm riêng biệt.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6">
        {/* Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-base-content mb-4">
            Danh mục
          </h2>
          <div className="flex flex-wrap gap-2">
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

        {/* Collections */}
        {filteredCollections.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCollections.map((item, index) => (
              <div
                key={index}
                className="group relative bg-base-100 rounded-2xl p-5 border border-base-200 hover:shadow-lg hover:border-primary transition-all duration-300 text-center"
              >
                <div className="absolute top-0 right-0 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-bl-md rounded-tr-md shadow-sm">
                  {item?.category}
                </div>

                {/* Icon */}
                <div className="relative inline-block mb-4 mt-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={item?.image}
                      alt={item?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {item?.isPopular && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-orange-500 text-white p-1 rounded-full">
                        <Star className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-base-content mb-1 line-clamp-1">
                      {item?.name}
                    </h3>
                    <p className="text-sm text-base-content/80 leading-relaxed line-clamp-2">
                      {item?.description}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between gap-4 text-xs text-base-content/70">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{item?.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>{item?.downloads}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${
                          item?.active
                            ? "bg-primary text-primary-content hover:bg-primary/80"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      onClick={() =>
                        item?.active
                          ? window.open(item.url, "_blank")
                          : alert("Tính năng đang phát triển!")
                      }
                    >
                      {item?.active ? "Cài đặt" : "Đang phát triển"}
                    </button>

                    <button className="p-2 border border-base-300 text-base-content rounded-lg hover:bg-base-200 transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">
              Chưa có phiên bản nào
            </h3>
            <p className="text-base-content/80">
              Dữ liệu đang được cập nhật, vui lòng quay lại sau.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
