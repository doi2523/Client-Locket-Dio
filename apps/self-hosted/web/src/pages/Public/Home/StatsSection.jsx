import { useEffect, useRef, useState } from "react";

const statsData = [
  {
    value: 10000,
    display: "10K+",
    label: "Người dùng hoạt động",
    color: "from-blue-400 to-cyan-400",
  },
  {
    value: 1.7,
    display: "1.7M+",
    label: "Ảnh & Video đã tạo",
    color: "from-purple-400 to-pink-400",
  },
  {
    value: 30,
    display: "30GB+",
    label: "Dung lượng sử dụng mỗi ngày",
    color: "from-green-400 to-emerald-400",
  },
  {
    value: 4.8,
    display: "4.8/5★",
    label: "Đánh giá trung bình",
    color: "from-yellow-400 to-orange-400",
  },
];

const AnimatedNumber = ({ value, display }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const duration = 1200;
          const start = performance.now();

          const animate = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            setCount(progress * value);
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      {display.includes("K")
        ? `${Math.round(count / 1000)}K+`
        : display.includes("GB")
        ? `${Math.round(count)}GB+`
        : display.includes("★")
        ? `${count.toFixed(1)}/5★`
        : display.includes("M")
        ? `${count.toFixed(1)}M+`
        : Math.round(count)}
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Thống kê về Locket Camera
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center group">
              <div
                className={`text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 transition-transform duration-300 group-hover:scale-110`}
              >
                <AnimatedNumber
                  value={stat.value}
                  display={stat.display}
                />
              </div>
              <p className="text-base-content/80 text-sm md:text-base font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
