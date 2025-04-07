import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../../../context/AppContext";
import BouncyLoader from "../Loading/Bouncy";
import { RiEmotionHappyLine } from "react-icons/ri";
import { TbMoodCrazyHappy } from "react-icons/tb";

const StatusServer = () => {
  const { useloading } = useApp();
  const {isStatusServer, setIsStatusServer} = useloading; // null: đang kiểm tra, true/false: kết quả

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get("https://apilocket-diov2.onrender.com/");
        setIsStatusServer(response.status === 200);
      } catch (error) {
        setIsStatusServer(false);
      }
    };

    checkServer();
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      {isStatusServer === null ? (
        <>
          <div className="inline-grid *:[grid-area:1/1]">
            <div className="status status-warning animate-bounce"></div>
          </div>
          <span className="text-orange-600 font-medium">Server is running <BouncyLoader size={20} color="orange"/> </span>
        </>
      ) : isStatusServer ? (
        <>
          <div className="inline-grid *:[grid-area:1/1]">
            <div className="status status-success animate-ping"></div>
            <div className="status status-success"></div>
          </div>
          <span className="text-green-600 font-medium flex items-center">Server is live <RiEmotionHappyLine className="ml-1"/> </span>
        </>
      ) : (
        <>
          <div className="inline-grid *:[grid-area:1/1]">
            <div className="status status-error"></div>
          </div>
          <span className="text-red-600 font-medium flex items-center">Server is down <TbMoodCrazyHappy className="ml-1"/> </span>
        </>
      )}
    </div>
  );
};

export default StatusServer;
