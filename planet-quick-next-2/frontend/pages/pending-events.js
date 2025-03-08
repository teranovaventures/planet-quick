"use client";
import React, { useState, useEffect } from "react";

export default function PendingEventsPage({ user }) {
  const [events, setEvents] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedLists, setSelectedLists] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Debugging: Log when `isSelecting` changes
  useEffect(() => {
    console.log("🌀 isSelecting changed:", isSelecting);
  }, [isSelecting]);

  // Ensure shake animation is available
  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleSheet = document.createElement("style");
      styleSheet.innerText = `
        @keyframes tiltShake {
          0% { transform: rotate(-3deg) scale(1.02); }
          50% { transform: rotate(3deg) scale(1.02); }
          100% { transform: rotate(-3deg) scale(1.02); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  // Fetch data from Strapi
  useEffect(() => {
    if (!user || !user.id) {
      console.log("🚨 No user found or invalid user ID.");
      return;
    }

    const userId = String(user.id); // Ensure user ID is a string to match Strapi filters

    // Fetch pending events
    fetch(`http://localhost:1337/api/events?filters[pqeventstatus][$eq]=pending&filters[pqcoordinator][$eq]=${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || 'YOUR_STRAPI_API_TOKEN'}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📌 Events API Response:", data);
        setEvents(data.data || []);
      })
      .catch((err) => console.error("🚨 Error fetching events:", err));

    // Fetch pending shopping lists (assuming a similar Strapi endpoint)
    fetch(`http://localhost:1337/api/shoppinglists?filters[state][$eq]=pending&filters[pqcoordinator][$eq]=${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || 'YOUR_STRAPI_API_TOKEN'}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📝 Shopping Lists API Response:", data);
        setShoppingLists(data.data || []);
      })
      .catch((err) => console.error("🚨 Error fetching shopping lists:", err));

    // Fetch pending groups (assuming a similar Strapi endpoint)
    fetch(`http://localhost:1337/api/groups?filters[state][$eq]=pending&filters[pqcoordinator][$eq]=${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || 'YOUR_STRAPI_API_TOKEN'}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("👥 Groups API Response:", data);
        setGroups(data.data || []);
      })
      .catch((err) => console.error("🚨 Error fetching groups:", err));
  }, [user]);

  const handleSelect = (id, type) => {
    if (!isSelecting) return;

    if (type === "event") {
      setSelectedEvent((prev) => (prev === id ? null : id));
    } else if (type === "list") {
      setSelectedLists((prev) => (prev.includes(id) ? [] : [id]));
    } else if (type === "group") {
      setSelectedGroups((prev) => (prev.includes(id) ? [] : [id]));
    }

    setTimeout(updateLaunchButtonState, 0);
  };

  const updateLaunchButtonState = () => {
    setTimeout(() => {
      const isThreeSelected =
        selectedEvent !== null && selectedLists.length === 1 && selectedGroups.length === 1;
      setShowLaunch(isThreeSelected);
    }, 0);
  };

  const handleLaunch = () => {
    const missingSelections = [];
    if (!selectedEvent) missingSelections.push("an Event");
    if (selectedLists.length !== 1) missingSelections.push("a Shopping List");
    if (selectedGroups.length !== 1) missingSelections.push("a Group");

    if (missingSelections.length > 0) {
      alert(`🚨 Please pick ${missingSelections.join(", ")}.`);
      return;
    }

    setShowAnimation(true);
    setTimeout(() => {
      // Redirect to live-events page (ensure this route exists)
      window.location.href = "/live-events";
    }, 2500);
  };

  return (
    <div style={styles.testContainer}>
      <div style={styles.topRow}>
        <h1 style={{ fontFamily: "STIX Two Text, serif", fontSize: "35px" }}>Pending Events</h1>
      </div>

      {/* 🚀 Create Live Event Button */}
      {!isSelecting && (
        <button
          style={styles.createLiveEventBtn}
          onClick={() => {
            console.log("🚀 Create Live Event Clicked!");
            setIsSelecting(true);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a02626")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(143, 28, 28)")}
        >
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
            {data.length > 0 ? (
              data.map((item) => {
                const isSelected = selected === item.id || (Array.isArray(selected) && selected.includes(item.id));
                const isGreyedOut =
                  (type === "event" && selectedEvent !== null && selectedEvent !== item.id) ||
                  (type === "list" && selectedLists.length > 0 && !selectedLists.includes(item.id)) ||
                  (type === "group" && selectedGroups.length > 0 && !selectedGroups.includes(item.id));

                return (
                  <div key={item.id} style={{ position: "relative" }}>
                    {/* 🟤 Background Card */}
                    <div style={styles.eventTileBefore}></div>

                    {/* ⚪ Main White Tile */}
                    <div
                      style={{
                        ...styles.eventTile,
                        ...(isSelecting && !isSelected && !isGreyedOut ? styles.shaking : {}),
                        ...(isSelected ? styles.selectedTile : {}),
                        ...(isGreyedOut ? styles.greyedOutTile : {}),
                      }}
                      onClick={() => !isGreyedOut && handleSelect(item.id, type)}
                      onMouseEnter={(e) => {
                        if (isSelecting && !isSelected && !isGreyedOut) {
                          e.currentTarget.style.transform = "rotate(2deg) scale(1.05)";
                          e.currentTarget.style.boxShadow = "10px 10px 20px rgba(0, 0, 0, 0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isSelecting && !isSelected && !isGreyedOut) {
                          e.currentTarget.style.transform = "rotate(-2deg)";
                          e.currentTarget.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.15)";
                        }
                      }}
                    >
                      <h3 style={{ fontSize: "20px", margin: "5px 0" }}>{item.attributes?.title || item.title || "No Title"}</h3>
                      <p style={{ margin: "5px 0" }}>📅 {item.attributes?.date ? new Date(item.attributes.date).toLocaleDateString() : "No Date"}</p>
                      <p style={{ margin: "5px 0" }}>📍 {item.attributes?.location || item.attributes?.pqaddress || "No Location"}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: "center", color: "#666", marginTop: "10px", fontFamily: "STIX Two Text, serif" }}>
                No pending {type.toLowerCase()} found.
              </p>
            )}
          </div>
        </section>
      ))}

      {/* ✅ "Launch Live Event" Button (Only If 3+ Selected) */}
      {showLaunch && (
        <button
          style={styles.launchLiveEventBtn}
          onClick={handleLaunch}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0e4d84")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1263a1")}
        >
          🚀 Launch Live Event
        </button>
      )}

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
    minHeight: "100vh",
    position: "relative",
  },
  topRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
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
    fontFamily: "STIX Two Text, serif",
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
    overflowX: "auto",
    justifyContent: "center",
    marginTop: "20px",
    paddingBottom: "10px", // Allow scrolling
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
    background: "#1263a1",
    color: "white",
    transform: "scale(1.1)",
    border: "2px solid white",
  },
  greyedOutTile: {
    background: "#D3D3D3",
    color: "#A0A0A0",
    cursor: "not-allowed",
    transform: "scale(0.95)",
    filter: "grayscale(70%)",
  },
  eventTileBefore: {
    position: "absolute",
    top: "12px",
    left: "12px",
    width: "100%",
    height: "100%",
    background: "#E5C9A8",
    borderRadius: "46px",
    transform: "rotate(-5deg)",
    zIndex: -1,
  },
  shaking: {
    animation: "tiltShake 0.4s ease-in-out infinite alternate",
    transformOrigin: "center",
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
    position: "absolute",
    top: "155px", // Adjusted for navbar
    left: "20px",
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
    position: "absolute",
    bottom: "20px",
    left: "20px",
  },
  launchLiveEventBtnHover: {
    backgroundColor: "#0e4d84",
  },
  animationText: {
    fontSize: "24px",
    color: "#1263a1",
    fontWeight: "bold",
    animation: "fadeIn 1.5s ease-in-out",
    fontFamily: "STIX Two Text, serif",
  },
  animationOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    background: "rgba(255, 255, 255, 0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999",
  },
};