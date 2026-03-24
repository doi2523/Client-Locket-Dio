# CaptionEditorStore.md

## Mục đích

Store dùng để lưu **caption overlay đang chỉnh sửa** và **dữ liệu gửi lên server**.
Format store **giống format server**, nên **không cần map lại khi gọi API**.

---

## Default Overlay

```js
const defaultPostOverlay = {
  overlay_id: "standard",
  color_top: "",
  color_bottom: "",
  text_color: "#FFFFFF",
  icon: "",
  caption: "",
  type: "default",
  background: [],
};
```

---

## Store Structure

```js
{
  overlay: {
    overlay_id: "",
    color_top: "",
    color_bottom: "",
    text_color: "",
    icon: "",
    caption: "",
    type: "",
    background: []
  }
}
```

---

## Cách dùng

### Cập nhật overlay

```js
updateOverlay({ caption: "Hello" });

updateOverlay({
  color_top: "#ff0000",
  color_bottom: "#00ff00",
});

updateOverlay({ text_color: "#000" });

updateOverlay({ icon: "https://..." });
```

### Reset

```js
resetOverlay();
```

### Lấy dữ liệu gửi API

```js
const overlayData = useCaptionEditorStore.getState().overlayData;
```

---

## Dữ liệu gửi server (ví dụ)

```json
{
  "overlay_id": "caption:star_sign",
  "color_top": "#FF2400",
  "color_bottom": "#FF5733",
  "text_color": "#FFFFFF",
  "icon": "https://...",
  "caption": "Mùa Bạch Dương",
  "type": "star_sign",
  "background": ["#FF2400", "#FF5733"]
}
```

---
