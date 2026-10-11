import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { IconSymbol } from "@/components/ui/icon-symbol";

const { width } = Dimensions.get("window");

import { HomePage } from "@/store/slices/appSlice";

interface CameraScreenProps {
  goToPage: (pageKey: HomePage) => void;
}


export default function CameraScreen({ goToPage }: CameraScreenProps) {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const cameraRef = useRef<CameraView | null>(null);

  const handleFlipCamera = () => {
    setFacing((current) =>
      current === "back" ? "front" : "back"
    );
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: true,
        base64: false,
        shutterSound: false,
        mirror: facing === "front",
      });

      if (photo?.uri) {
        setPhotoUri(photo.uri);
      }
    } catch (error) {
      console.error("Lỗi khi chụp ảnh:", error);

      Alert.alert(
        "Lỗi",
        "Không thể chụp ảnh. Vui lòng thử lại."
      );
    } finally {
      setIsCapturing(false);
    }
  };

  const handleOpenGallery = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Lỗi",
          "Cần quyền truy cập thư viện ảnh"
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Lỗi khi mở thư viện:", error);

      Alert.alert(
        "Lỗi",
        "Không thể mở thư viện ảnh"
      );
    }
  };

  const handleCancelPhoto = () => {
    setPhotoUri(null);
  };

  const handleSendPhoto = () => {
    if (!photoUri) return;

    Alert.alert(
      "Gửi ảnh",
      `Đang gửi ảnh: ${photoUri.split("/").pop()}`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Gửi",
          onPress: () => {
            console.log("Gửi ảnh:", photoUri);
            setPhotoUri(null);
          },
        },
      ]
    );
  };

  const handleCustomAction = () => {
    Alert.alert(
      "Tùy chỉnh",
      "Chức năng chỉnh sửa ảnh",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Chỉnh sửa",
          onPress: () => console.log("Mở editor"),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* CAMERA BOX LUÔN HIỆN */}
      <View style={styles.cameraContainer}>
        {/* Chưa kiểm tra permission */}
        {!permission ? (
          <View style={styles.cameraPlaceholder}>
            <ActivityIndicator
              size="large"
              color="white"
            />
          </View>
        ) : photoUri ? (
          /* Đã có ảnh */
          <Image
            source={{ uri: photoUri }}
            style={styles.cameraBox}
          />
        ) : permission.granted ? (
          /* Đã cấp quyền camera */
          <CameraView
            ref={cameraRef}
            style={styles.cameraBox}
            facing={facing}
            mirror={facing === "front"}
            autofocus="on"
          />
        ) : (
          /* Chưa cấp quyền */
          <View style={styles.permissionOverlay}>
            <IconSymbol
              name="camera.fill"
              size={48}
              color="white"
            />

            <Text style={styles.permissionText}>
              Ứng dụng cần quyền truy cập camera
              để chụp ảnh
            </Text>

            <Pressable
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>
                Cấp quyền Camera
              </Text>
            </Pressable>
          </View>
        )}

        {/* Loading khi chụp */}
        {isCapturing && (
          <View style={styles.capturingOverlay}>
            <ActivityIndicator
              size="large"
              color="white"
            />

            <Text style={styles.capturingText}>
              Đang chụp...
            </Text>
          </View>
        )}
      </View>

      {/* BUTTONS */}
      <View style={styles.buttonRow}>
        {photoUri ? (
          <>
            <Pressable
              style={styles.buttonArea}
              onPress={handleCancelPhoto}
            >
              <View style={styles.actionButton}>
                <IconSymbol
                  name="xmark"
                  size={30}
                  color="white"
                />
              </View>
            </Pressable>

            <Pressable
              style={styles.buttonArea}
              onPress={handleSendPhoto}
            >
              <View
                style={[
                  styles.captureButton,
                  styles.sendButton,
                ]}
              >
                <IconSymbol
                  name="paperplane"
                  color="white"
                  size={50}
                />
              </View>
            </Pressable>

            <Pressable
              style={styles.buttonArea}
              onPress={handleCustomAction}
            >
              <View style={styles.actionButton}>
                <IconSymbol
                  name="sparkles"
                  size={40}
                  color="white"
                />
              </View>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              style={styles.buttonArea}
              onPress={handleOpenGallery}
            >
              <View style={styles.actionButton}>
                <IconSymbol
                  name="photo.on.rectangle"
                  size={45}
                  color="white"
                />
              </View>
            </Pressable>

            <Pressable
              style={styles.buttonArea}
              onPress={handleTakePhoto}
              disabled={
                isCapturing || !permission?.granted
              }
            >
              <View
                style={[
                  styles.captureButton,
                  isCapturing &&
                    styles.capturingButton,
                ]}
              />
            </Pressable>

            <Pressable
              style={styles.buttonArea}
              onPress={handleFlipCamera}
              disabled={!permission?.granted}
            >
              <View style={styles.actionButton}>
                <IconSymbol
                  name="arrow.2.circlepath"
                  size={45}
                  color="white"
                />
              </View>
            </Pressable>
          </>
        )}
      </View>

      {/* HISTORY */}
      <View style={styles.historyContainer}>
        <Pressable
          style={styles.historyButton}
          onPress={() => goToPage("history")}
        >
          <Text style={styles.historyText}>
            Lịch sử
          </Text>

          <IconSymbol
            name="chevron.compact.down"
            size={40}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  cameraContainer: {
    width: width,
    aspectRatio: 1,

    borderRadius: 64,
    overflow: "hidden",

    backgroundColor: "#000",
  },

  cameraBox: {
    width: "100%",
    height: "100%",
  },

  cameraPlaceholder: {
    width: "100%",
    height: "100%",

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#111",
  },

  permissionOverlay: {
    width: "100%",
    height: "100%",

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 40,

    backgroundColor: "#111",
  },

  permissionText: {
    marginTop: 20,

    textAlign: "center",

    fontSize: 16,
    lineHeight: 23,

    color: "white",
  },

  permissionButton: {
    marginTop: 20,

    paddingHorizontal: 24,
    paddingVertical: 12,

    borderRadius: 20,

    backgroundColor: "white",
  },

  permissionButtonText: {
    color: "black",

    fontSize: 15,
    fontWeight: "600",
  },

  capturingOverlay: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "rgba(0,0,0,0.5)",

    justifyContent: "center",
    alignItems: "center",
  },

  capturingText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },

  buttonRow: {
    flexDirection: "row",

    width: width,

    justifyContent: "space-around",
    alignItems: "center",

    marginTop: 40,

    paddingHorizontal: 8,

    height: 140,
  },

  buttonArea: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 40,
  },

  captureButton: {
    width: 90,
    height: 90,

    borderRadius: 100,

    borderWidth: 4,
    borderColor: "#000000",

    justifyContent: "center",
    alignItems: "center",

    elevation: 3,

    backgroundColor: "#92929272",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  capturingButton: {
    backgroundColor: "#f0f0f0",
  },

  sendButton: {
    backgroundColor: "#34C759",
    borderColor: "#28A745",
  },

  actionButton: {
    justifyContent: "center",
    alignItems: "center",
  },

  historyContainer: {
    justifyContent: "center",
    alignItems: "center",

    marginBottom: -50,
  },

  historyButton: {
    justifyContent: "center",
    alignItems: "center",

    flexDirection: "column",
  },

  historyText: {
    color: "white",

    fontSize: 20,
    fontWeight: "600",
  },
});