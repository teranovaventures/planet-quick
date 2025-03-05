"use client";
import React, { useState, useEffect } from "react";

export default function TestPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedLists, setSelectedLists] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const launchDisabled = (selectedEvent ? 1 : 0) + selectedLists.length + selectedGroups.length !== 3;

  

  const events = [
    { id: 1, title: "5th Grade Fundraiser", date: "Mar 8, 2025", time: "2:00 PM", goal: "TBD" },
    { id: 2, title: "School Gala", date: "Mar 12, 2025", time: "7:30 PM", goal: "$1,000" },
    { id: 3, title: "Volunteer Drive", date: "Apr 1, 2025", time: "10:00 AM", goal: "TBD" },
    { id: 4, title: "Basketball Tournament", date: "Mar 15, 2025", time: "5:00 PM", goal: "$800" },
    { id: 5, title: "Spring Concert", date: "Apr 10, 2025", time: "6:00 PM", goal: "$2,000" },
  ];

  const shoppingLists = [
    { id: 1, title: "Gala Dinner List", date: "Mar 10, 2025", time: "TBD", goal: "$500" },
    { id: 2, title: "Fundraiser Snacks", date: "Mar 7, 2025", time: "TBD", goal: "$200" },
    { id: 3, title: "Basketball Snacks", date: "Mar 14, 2025", time: "TBD", goal: "$350" },
    { id: 4, title: "Spring Concert Catering", date: "Apr 8, 2025", time: "TBD", goal: "$1,500" },
  ];

  const groups = [
    { id: 1, title: "5th Grade Parents", date: "Mar 6, 2025", time: "TBD", goal: "TBD" },
    { id: 2, title: "School Volunteers", date: "Mar 10, 2025", time: "TBD", goal: "TBD" },
    { id: 3, title: "Basketball Parents", date: "Mar 14, 2025", time: "TBD", goal: "TBD" },
    { id: 4, title: "Spring Concert Staff", date: "Apr 7, 2025", time: "TBD", goal: "TBD" },
  ];

  

        useEffect(() => {
          if (typeof document !== "undefined") {
            const styleSheet = document.createElement("style");
            styleSheet.innerText = `
              @keyframes tiltShake {
                0% { transform: rotate(-3deg) scale(1.02); }
                100% { transform: rotate(3deg) scale(1.02); }
              }
            `;
            document.head.appendChild(styleSheet);
          }
        }, []); // ✅ Ensures this runs **only once** when the component mounts




        const handleSelect = (id, type) => {
          if (!isSelecting) return;
      
          if (type === "event") {
              setSelectedEvent(prev => prev === id ? null : id); // ✅ Only one event can be selected
          } else if (type === "list") {
              setSelectedLists(prev => prev.includes(id) ? [] : [id]); // ✅ Only one shopping list can be selected
          } else if (type === "group") {
              setSelectedGroups(prev => prev.includes(id) ? [] : [id]); // ✅ Only one group can be selected
          }
      
          setTimeout(updateLaunchButtonState, 0);
      };
      
      
      const updateLaunchButtonState = () => {
        setTimeout(() => {
            const isThreeSelected =
                selectedEvent !== null && 
                selectedLists.length === 1 && 
                selectedGroups.length === 0; // ✅ Requires exactly 1 per row
    
            if (isThreeSelected) {
                setShowLaunch(true);  // ✅ Show the button
            } else {
                setShowLaunch(false); // ✅ Hide button when conditions aren’t met
            }
        }, 0);
    };





  return (
    <div style={styles.testContainer}>
      <div style={styles.topRow}>
        <h1>Pending Events</h1>
      </div>

      {/* 🚀 Create Live Event Button */}
      {!isSelecting && (
        <button style={styles.createLiveEventBtn} onClick={() => setIsSelecting(true)}>
        🚀 Create Live Event
      </button>
      
      )}

      {/* 📌 Sections */}
      {[
        { title: "Pending Events", data: events, type: "event", selected: selectedEvent },
        { title: "Pending Shopping Lists", data: shoppingLists, type: "list", selected: selectedLists },
        { title: "Pending Invitation Lists", data: groups, type: "group", selected: selectedGroups },
      ].map(({ title, data, type, selected }, index) => (
        <section key={index} style={styles.pendingSection}>
          <h2 style={styles.sectionTitle}>{title}</h2>
          <hr style={styles.sectionUnderline} />

          <div style={styles.eventCarousel}>


          
          
                          {data.map((item) => {
                  const isSelected = selected === item.id || (Array.isArray(selected) && selected.includes(item.id));
                  const isGreyedOut =
                    (type === "event" && selectedEvent !== null && selectedEvent !== item.id) ||
                    (type === "list" && selectedLists.length > 0 && !selectedLists.includes(item.id)) ||
                    (type === "group" && selectedGroups.length > 0 && !selectedGroups.includes(item.id));

                  return (
                    <div key={item.id} style={{ position: "relative" }}>
                      {/* 🟤 Tan Background Card (Behind Main Tile) */}
                      <div style={styles.eventTileBefore}></div>

                      {/* ⚪ Main White Tile */}
                      <div
                        style={{
                          ...styles.eventTile,
                          ...(isSelecting && !isGreyedOut ? styles.shaking : {}), // ✅ Tiles shake until one is picked
                          ...(isSelected ? styles.selectedTile : {}), // ✅ Stops shaking once selected
                          ...(isGreyedOut ? styles.greyedOutTile : {}), // ✅ Grey out unselected tiles in the row
                        }}
                        onClick={() => !isGreyedOut && handleSelect(item.id, type)} // ✅ Prevent clicking greyed-out tiles
                      >
                        <h3>{item.title}</h3>
                        <p>📅 {item.date} ⏰ {item.time}</p>
                        <p>🎯 Goal: {item.goal}</p>
                      </div>
                    </div>
                  );
                })}




          </div>
        </section>
      ))}




      {/* ✅ "Launch Live Event" Button (Only If 3+ Selected) */}
      {showLaunch && (
          <button
          style={{
              ...styles.launchLiveEventBtn,
              opacity: showLaunch ? 1 : 0.5, // ✅ Button is greyed out when disabled
              cursor: showLaunch ? "pointer" : "not-allowed", // ✅ Prevents clicking if disabled
          }}
          disabled={!showLaunch} // ✅ Disables clicking until 3 selections are made
          onClick={() => {
              const missingSelections = [];
      
              if (!selectedEvent) missingSelections.push("an Event");
              if (selectedLists.length !== 1) missingSelections.push("a Shopping List");
              if (selectedGroups.length !== 1) missingSelections.push("a Group");
      
              if (missingSelections.length > 0) {
                  alert(`🚨 Please pick ${missingSelections.join(", ")}.`);
                  return; // ✅ Stops event from launching if selections are missing
              }
      
              setShowAnimation(true);
              setTimeout(() => {
                  window.location.href = "/live-events"; // ✅ Redirects to Live Events page
              }, 2500);
          }}
      >
          🚀 Launch Live Event
      </button>
      )}
            
            
            
            onClick={() => {
              const missingSelections = [];
          
              if (!selectedEvent) missingSelections.push("an Event");
              if (selectedLists.length !== 1) missingSelections.push("a Shopping List");
              if (selectedGroups.length !== 1) missingSelections.push("a Group");
          
              if (missingSelections.length > 0) {
                  alert(`🚨 Please pick ${missingSelections.join(", ")}.`);
                  return; // ✅ Stops event from launching if selections are missing
              }
          
              setShowAnimation(true);
              setTimeout(() => {
                  window.location.href = "/live-events"; // ✅ Redirects to Live Events page
              }, 2500);
          }}




      {/* 🎉 End Animation */}
      {showAnimation && (
        <div style={styles.animationOverlay}>
          <h2 style={styles.animationText}>🎉 Way to Planet Quick! 🚀</h2>
        </div>
      )}
    </div>
  );
}

  
  const styles = {
    testContainer: {
      textAlign: "center",
      padding: "20px",
      background: "#FAF3E0", // Soft beige background
      height: "100vh",
    },
    pendingSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "40px",
    },
    sectionTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    sectionUnderline: {
      border: "none",
      height: "2px",
      background: "#1263a1",
      width: "80%",
      marginBottom: "15px",
    },
    eventCarousel: {
      display: "flex",
      gap: "20px",
      overflow: "hidden",
      justifyContent: "center",
      marginTop: "20px",
    },
    eventTile: {
      width: "250px",
      height: "150px",
      background: "white",
      padding: "20px",
      borderRadius: "46px",
      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.15)",
      transform: "rotate(-2deg)",
      transition: "0.3s ease-in-out",
      position: "relative",
      cursor: "pointer",
      fontFamily: "STIX Two Text, serif",
      textAlign: "center",
      border: "2px solid transparent",
    },
    eventTileHover: {
      transform: "rotate(2deg) scale(1.05)",
      boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.3)",
    },
    selectedTile: {
      background: "black",
      color: "white",
      transform: "scale(1.1)",
      border: "2px solid white",
    },
    greyedOutTile: {
      background: "#D3D3D3", // ✅ Light grey for unselected items in the same row
      color: "#A0A0A0", // ✅ Faded text
      cursor: "not-allowed",
      transform: "scale(0.95)", // ✅ Slightly shrink greyed-out tiles
      filter: "grayscale(70%)", // ✅ Add a slight grey filter to dull unselected items
    },
    eventTileBefore: {
      position: "absolute",
      top: "12px",
      left: "12px",
      width: "100%",
      height: "100%",
      background: "#E5C9A8", // ✅ Tan Background
      borderRadius: "46px",
      transform: "rotate(-5deg)",
      zIndex: "-1",
    },
    // ✅ FIX 1: Apply the correct animation in `shaking`
    shaking: {
      animation: "tiltShake 0.4s ease-in-out infinite alternate", // ✅ Uses tiltShake keyframes
      transformOrigin: "center",
    },
    "@keyframes shake": {
    "0%": { transform: "rotate(-4deg) scale(1.03)" },
    "50%": { transform: "rotate(4deg) scale(1.05)" },
    "100%": { transform: "rotate(-4deg) scale(1.03)" },
    },
    createLiveEventBtn: {
      backgroundColor: "rgb(143, 28, 28)",
      color: "white",
      padding: "12px 20px",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "46px",
      border: "none",
      transition: "0.3s ease-in-out",
      position: "absolute", // ✅ Move to top left
      top: "155px", // ✅ Adjust for navbar spacing
      left: "190px", // ✅ Align to left side
    },
    createLiveEventBtnHover: {
      backgroundColor: "#a02626",
    },
    launchLiveEventBtn: {
      backgroundColor: "#1263a1",
      color: "white",
      padding: "12px 20px",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "46px",
      border: "none",
      marginTop: "20px",
      transition: "0.3s ease-in-out",
      position: "absolute", // ✅ Move to top left
      bottom: "-80px", // ✅ Adjust for navbar spacing
      left: "190px", // ✅ Align to left side
    },
    launchLiveEventBtnHover: {
      backgroundColor: "#0e4d84",
    },
    deleteBtn: {
      backgroundColor: "#d9534f",
      color: "white",
      padding: "10px 16px",
      fontSize: "14px",
      borderRadius: "46px",
      cursor: "pointer",
      border: "none",
      transition: "0.3s ease-in-out",
    },
    deleteBtnHover: {
      backgroundColor: "#b52b27",
    },
    arrow: {
      fontSize: "30px",
      cursor: "pointer",
      background: "none",
      border: "none",
      transition: "0.3s ease-in-out",
    },
    arrowHover: {
      color: "#1263a1",
      transform: "scale(1.2)",
    },
    animationText: {
      fontSize: "24px",
      color: "#1263a1",
      fontWeight: "bold",
      animation: "fadeIn 1.5s ease-in-out",
    },
    animationOverlay: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      background: "rgba(255, 255, 255, 0.9)", // ✅ Light Overlay
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "9999",
    },
    "@keyframes tiltShake": {
    "0%": { transform: "rotate(-3deg) scale(1.02)" }, // ✅ Tilt left
    "100%": { transform: "rotate(3deg) scale(1.02)" }, // ✅ Tilt right
    },
  };