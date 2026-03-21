const createIntValue = (value) => ({
  "@type": "type.googleapis.com/google.protobuf.Int64Value",
  value: value.toString(),
});

function generateUUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const createAnalytics = () => ({
  experiments: {
    flag_4: createIntValue(43),
    flag_10: createIntValue(505),
    flag_23: createIntValue(400),
    flag_22: createIntValue(1203),
    flag_19: createIntValue(52),
    flag_18: createIntValue(1203),
    flag_16: createIntValue(303),
    flag_15: createIntValue(501),
    flag_14: createIntValue(500),
    flag_25: createIntValue(23),
  },
  amplitude: {
    device_id: generateUUIDv4(),
    session_id: createIntValue(Date.now().toString()),
  },
  google_analytics: {
    app_instance_id: "5BDC04DA16FF4B0C9CA14FFB9C502900",
  },
  platform: "ios",
});

module.exports = {
  createAnalytics,
};
