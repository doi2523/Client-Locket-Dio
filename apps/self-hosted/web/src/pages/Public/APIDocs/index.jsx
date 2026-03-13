import React, { useState, useMemo, useRef, useEffect } from "react";
import { Code, Copy, Check, Book, Music, Cloud, Search } from "lucide-react";

// Constants - Dễ dàng thêm API mới
const API_CATEGORIES = {
  "Spotify API": {
    icon: Music,
    description: "Tích hợp với Spotify để tìm kiếm và phát nhạc",
    endpoints: [
      {
        id: "spotify-search",
        method: "POST",
        path: "/api/spotifyV2",
        title: "Tìm kiếm bài hát",
        description: "Tìm kiếm bài hát qua URL Spotify",
      },
    ],
  },
  "Weather API": {
    icon: Cloud,
    description: "Lấy thông tin thời tiết theo vị trí",
    endpoints: [
      {
        id: "weather-current",
        method: "POST",
        path: "/api/weatherV2",
        title: "Thời tiết hiện tại",
        description: "Lấy thông tin thời tiết hiện tại theo tọa độ",
      },
    ],
  },
};

// API Details Configuration
const ENDPOINT_DETAILS = {
  "spotify-search": {
    parameters: [
      {
        name: "spotifyUrl",
        type: "string",
        required: true,
        description: "Link bài hát Spotify URL cần tìm kiếm",
      },
    ],
    response: {
      status: "success",
      message: "Lấy thông tin bài hát thành công!",
      data: {
        date: "2024-09-27T00:00:00.000Z",
        title: "Nếu Những Tiếc Nuối",
        type: "track",
        track: "Nếu Những Tiếc Nuối",
        artist: "Vũ.",
        image:
          "https://image-cdn-ak.spotifycdn.com/image/ab67616d0000b273be066d7fd668d8a0672b1245",
        audio:
          "https://p.scdn.co/mp3-preview/2875008b45f651d2390d10d2cf688ecb50f14572",
        spotify_url: "https://open.spotify.com/track/2dPJtlvoa3GDowCh035M8P",
        preview_url:
          "https://p.scdn.co/mp3-preview/2875008b45f651d2390d10d2cf688ecb50f14572",
        preview_url_V2: [
          "https://p.scdn.co/mp3-preview/2875008b45f651d2390d10d2cf688ecb50f14572",
        ],
      },
    },
  },
  "weather-current": {
    parameters: [
      {
        name: "lat",
        type: "number",
        required: true,
        description: "Vĩ độ",
      },
      {
        name: "lon",
        type: "number",
        required: true,
        description: "Kinh độ",
      },
    ],
    response: {
      status: "success",
      message: "Lấy thông tin thời tiết thành công!",
      data: {
        current: {
          temp_c: 33.2,
          temp_c_rounded: 33,
          condition: "Patchy light rain",
          icon: "//cdn.weatherapi.com/weather/64x64/day/293.png",
          temperature: 119.7,
          cloud_cover: 0.25,
          is_daylight: true,
          wk_condition: "lightRain",
        },
        location: {
          name: "Bac Ninh",
          region: "",
          country: "Vietnam",
          lat: 21.183,
          lon: 106.05,
          tz_id: "Asia/Bangkok",
          localtime_epoch: 1754046896,
          localtime: "2025-08-01 18:14",
        },
      },
    },
  },
};

// Code Examples Configuration
const CODE_EXAMPLES = {
  "spotify-search": {
    curl: `curl -X POST "https://api.example.com/api/spotifyV2" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Locket-Dio-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"spotifyUrl": "https://open.spotify.com/track/2dPJtlvoa3GDowCh035M8P?si=EqxoHvkBRxy9Q31roW797w"}'`,
  },
  "weather-current": {
    curl: `curl -X POST "https://api.example.com/api/weatherV2" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Locket-Dio-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"lat": 21.0285, "lon": 105.8542}'`,
  },
};

// Utility Functions
const getMethodColor = (method) => {
  const colors = {
    GET: "bg-green-100 text-green-800 border-green-200",
    POST: "bg-blue-100 text-blue-800 border-blue-200",
    PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
    DELETE: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[method] || "bg-gray-100 text-gray-800 border-gray-200";
};

const formatJSON = (obj) => JSON.stringify(obj, null, 2);

// Custom Hooks
const useClipboard = () => {
  const [copiedCode, setCopiedCode] = useState("");

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return { copiedCode, copyToClipboard };
};

const useSearchResults = (searchTerm) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return Object.values(API_CATEGORIES).flatMap((cat) =>
      cat.endpoints.map((endpoint) => ({
        ...endpoint,
        categoryName: Object.keys(API_CATEGORIES).find(
          (key) => API_CATEGORIES[key] === cat
        ),
        categoryIcon: cat.icon,
      }))
    );

    const results = [];

    Object.entries(API_CATEGORIES).forEach(([categoryName, category]) => {
      category.endpoints.forEach((endpoint) => {
        const term = searchTerm.toLowerCase();
        if (
          endpoint.title.toLowerCase().includes(term) ||
          endpoint.path.toLowerCase().includes(term) ||
          categoryName.toLowerCase().includes(term) ||
          endpoint.description.toLowerCase().includes(term)
        ) {
          results.push({
            ...endpoint,
            categoryName,
            categoryIcon: category.icon,
          });
        }
      });
    });

    return results;
  }, [searchTerm]);
};

// Components
const Header = () => (
  <header className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Book className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">API Documentation</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            v2.0
          </span>
        </div>
      </div>
    </div>
  </header>
);

const Sidebar = ({ setSelectedEndpoint, selectedEndpoint }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchResults = useSearchResults(searchTerm);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleSelect = (endpointId) => {
    setSelectedEndpoint(endpointId);
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm API..."
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setIsOpen(true)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
            >
              {searchResults.length > 0 ? (
                searchResults.map((endpoint) => {
                  const Icon = endpoint.categoryIcon;
                  return (
                    <button
                      key={endpoint.id}
                      onClick={() => handleSelect(endpoint.id)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${
                        selectedEndpoint === endpoint.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span>{endpoint.title}</span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded ${getMethodColor(
                          endpoint.method
                        )}`}
                      >
                        {endpoint.method}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Không tìm thấy API phù hợp
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EndpointHeader = ({ endpoint }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-3">
          <span
            className={`px-3 py-1 text-sm font-medium rounded border ${getMethodColor(
              endpoint.method
            )}`}
          >
            {endpoint.method}
          </span>
          <code className="text-lg font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded">
            {endpoint.path}
          </code>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {endpoint.title}
        </h2>
        <p className="text-gray-600">{endpoint.description}</p>
      </div>
    </div>
  </div>
);

const ParametersTable = ({ parameters }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Parameters</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-medium text-gray-700">
              Tên
            </th>
            <th className="text-left py-2 px-3 font-medium text-gray-700">
              Kiểu
            </th>
            <th className="text-left py-2 px-3 font-medium text-gray-700">
              Bắt buộc
            </th>
            <th className="text-left py-2 px-3 font-medium text-gray-700">
              Mô tả
            </th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-2 px-3">
                <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
                  {param.name}
                </code>
              </td>
              <td className="py-2 px-3 text-gray-600">{param.type}</td>
              <td className="py-2 px-3">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    param.required
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {param.required ? "Có" : "Không"}
                </span>
              </td>
              <td className="py-2 px-3 text-gray-600">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ResponseExample = ({ response }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Response Example
    </h3>
    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <pre className="text-sm text-gray-100">
        <code>{formatJSON(response)}</code>
      </pre>
    </div>
  </div>
);

const CodeExamples = ({ examples, copiedCode, copyToClipboard }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Code className="w-5 h-5 mr-2" />
      Code Examples
    </h3>

    <div className="space-y-4">
      {Object.entries(examples).map(([lang, code]) => (
        <div
          key={lang}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {lang}
            </span>
            <button
              onClick={() => copyToClipboard(code, lang)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {copiedCode === lang ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã copy</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 bg-gray-900 text-gray-100 overflow-x-auto">
            <pre className="text-sm">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MainContent = ({ selectedEndpoint, allEndpoints }) => {
  const { copiedCode, copyToClipboard } = useClipboard();

  const selectedEndpointData = allEndpoints.find(
    (e) => e.id === selectedEndpoint
  );
  const selectedDetails = ENDPOINT_DETAILS[selectedEndpoint];
  const codeExamples = CODE_EXAMPLES[selectedEndpoint];

  if (!selectedEndpointData) return null;

  return (
    <div className="lg:col-span-9">
      <div className="space-y-6">
        <EndpointHeader endpoint={selectedEndpointData} />

        {selectedDetails?.parameters && (
          <ParametersTable parameters={selectedDetails.parameters} />
        )}

        {selectedDetails?.response && (
          <ResponseExample response={selectedDetails.response} />
        )}

        {codeExamples && (
          <CodeExamples
            examples={codeExamples}
            copiedCode={copiedCode}
            copyToClipboard={copyToClipboard}
          />
        )}
      </div>
    </div>
  );
};

// Main Component
const ReferencePage = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("spotify-search");

  const allEndpoints = useMemo(() => {
    return Object.values(API_CATEGORIES).flatMap((cat) => cat.endpoints);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Sidebar
            setSelectedEndpoint={setSelectedEndpoint}
            selectedEndpoint={selectedEndpoint}
          />
          <MainContent
            selectedEndpoint={selectedEndpoint}
            allEndpoints={allEndpoints}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferencePage;