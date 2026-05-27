// hooks/useMediaPalette.js

import { useEffect, useState } from "react";
import { getColorSync, getPaletteSync } from "colorthief";

export function useMediaPalette(post) {
  const { selectedFile } = post || {};

  const [palette, setPalette] = useState([]);
  const [dominantColor, setDominantColor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedFile) return;

    let mounted = true;
    let imageUrl = null;

    async function extractColors() {
      try {
        setLoading(true);
        setError(null);

        const img = new Image();

        img.crossOrigin = "anonymous";

        imageUrl =
          typeof selectedFile === "string"
            ? selectedFile
            : URL.createObjectURL(selectedFile);

        img.src = imageUrl;

        await img.decode();

        if (!mounted) return;

        // ===== dominant =====
        const dominant = getColorSync(img);

        setDominantColor(dominant.hex());

        // ===== palette =====
        const colors = getPaletteSync(img, {
          colorCount: 5,
        });

        let paletteHex = colors.map((c) => c.hex());

        // nếu chỉ có 1 màu -> fill thành 5 màu giống nhau
        if (paletteHex.length === 1) {
          paletteHex = Array(5).fill(paletteHex[0]);
        }

        setPalette(paletteHex);
      } catch (err) {
        console.error("Palette error:", err);

        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    extractColors();

    return () => {
      mounted = false;

      if (imageUrl && selectedFile instanceof File) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [selectedFile]);

  return {
    palette, // ['#e84393', '#0984e3', ...]
    dominantColor, // '#e84393'
    loading,
    error,
  };
}
