import { API_ENDPOINTS } from "@/config/apiConfig";
import { loginHeader } from "@/constants/constrain";
import api from "@/lib/axios";
import { instanceLocket } from "@/lib/axios.locket";
import { getToken } from "@/utils";
import { generateUUIDv4Upper } from "@/utils/generate/uuid";

export const GetAllMessage = async () => {
  try {
    const res = await api.post(API_ENDPOINTS.getAllMessages, {
      timestamp: null,
    });
    return res.data?.data;
  } catch (err) {
    console.warn("Failed", err);
  }
};

export const getMessagesWithUser = async (
  messageId, // 👈 uid của người cần lấy message
  timestamp = null
) => {
  try {
    const res = await api.post(API_ENDPOINTS.getMessagesWithUser, {
      messageId: messageId,
      timestamp,
    });
    return res.data?.data;
  } catch (err) {
    console.warn("Failed", err);
    return null;
  }
};

export const sendMessage = async (messageInfo) => {
  try {
    const { idToken } = getToken();

    const body = {
      data: {
        msg: messageInfo.message || " ", // Nội dung tin nhắn
        analytics: {
          amplitude: {
            device_id: generateUUIDv4Upper(),
            session_id: -1,
          },
          google_analytics: {
            app_instance_id: "e88d4daed0ded172248753851bf67772",
          },
          android_version: "1.196.0",
          android_build: "406",
          platform: "android",
        },
        client_token: generateUUIDv4Upper(),
        moment_uid: messageInfo?.moment_id || null,
        receiver_uid: messageInfo.receiver_uid,
      },
    };

    const response = await instanceLocket.post("sendChatMessageV2", body, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        ...loginHeader,
      },
    });

    return response.data;
  } catch (err) {
    console.error("sendMessage error:", err);
    throw err;
  }
};

export const markReadMessage = async (conversationId) => {
  try {
    const { idToken } = getToken();

    const body = {
      data: {
        conversation_uid: conversationId,
      },
    };

    const response = await instanceLocket.post("markAsRead", body, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        ...loginHeader,
      },
    });

    return response.data;
  } catch (err) {
    console.error("markReadMessage error:", err);
    throw err;
  }
};

export const sendReactionOnMessage = async (reactionData) => {
  try {
    const { idToken } = getToken();

    const body = {
      data: {
        message_id: reactionData.messageId,
        emoji: reactionData.emoji,
        conversation_id: reactionData.conversationId,
      },
    };

    const response = await instanceLocket.post(
      "sendChatMessageReaction",
      body,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          ...loginHeader,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("markReadMessage error:", err);
    throw err;
  }
};

export const deleteMessage = async (deleteData) => {
  try {
    const { idToken } = getToken();

    const body = {
      data: {
        message_uid: deleteData.message_uid,
        conversation_uid: deleteData.conversation_uid,
      },
    };

    const response = await instanceLocket.post("deleteChatMessage", body, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        ...loginHeader,
      },
    });

    return response.data;
  } catch (err) {
    console.error("markReadMessage error:", err);
    throw err;
  }
};
