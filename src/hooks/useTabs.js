import { useState, useEffect } from 'react';

export function useTabs() {
  const [openTabs, setOpenTabs] = useState(["file-1"]);
  const [activeTab, setActiveTab] = useState('file-1');

  //useEffect to Save tabs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("open-tabs", JSON.stringify(openTabs));
    } catch (error) {
      console.error("Failed to save tabs:", error);
    }
  }, [openTabs]);

  return { openTabs, setOpenTabs, activeTab, setActiveTab };
}