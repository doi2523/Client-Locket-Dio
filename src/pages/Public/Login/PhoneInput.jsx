import { COUNTRY_BY_CALLING_CODE } from "@/constants/phoneCodeMap";
import { useEffect, useState } from "react";

const formatPhone = (value) => {
  if (!value.startsWith("+")) return value;

  const digits = value.slice(1);

  // detect country code
  let countryCode = "";
  for (let len = 4; len >= 1; len--) {
    const code = digits.slice(0, len);
    if (COUNTRY_BY_CALLING_CODE[code]) {
      countryCode = code;
      break;
    }
  }

  if (!countryCode) return value;

  const rest = digits.slice(countryCode.length);

  // group mỗi 3 số
  const grouped = rest.match(/.{1,3}/g)?.join(" ") ?? "";

  return `+${countryCode}${grouped ? " " + grouped : ""}`;
};

export const PhoneInput = ({ value = "", onChange }) => {
  const [inner, setInner] = useState(value);
  const [flag, setFlag] = useState("🇻🇳");

  useEffect(() => {
    setInner(value);
  }, [value]);

  const handleChange = (input) => {
    let raw = input.replace(/[^0-9+]/g, "");

    if (!raw) {
      setInner("");
      setFlag("🇻🇳");
      onChange?.("");
      return;
    }

    if (!raw.startsWith("+")) {
      if (raw.startsWith("0")) {
        raw = "+84" + raw.slice(1);
      } else {
        raw = "+" + raw;
      }
    }

    const digits = raw.slice(1);
    for (let len = 4; len >= 1; len--) {
      const code = digits.slice(0, len);
      if (COUNTRY_BY_CALLING_CODE[code]) {
        setFlag(COUNTRY_BY_CALLING_CODE[code].flag);
        break;
      }
    }

    setInner(formatPhone(raw));
    onChange?.(raw);
  };

  return (
    <div className="relative">
      {/* Flag */}
      <span className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
        {flag}
      </span>

      {/* Input */}
      <input
        type="tel"
        value={inner}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="+84 912 345 678"
        className="
          w-full
          py-5
          pl-10
          rounded-lg
          input input-ghost
          border border-base-content
          text-base font-semibold
          placeholder:font-normal
          placeholder:italic
          placeholder:opacity-70
        "
      />
    </div>
  );
};
