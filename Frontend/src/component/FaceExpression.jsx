import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [detectedMood, setDetectedMood] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load Models
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    startVideo();
  };

  // 🔹 Start Camera
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error(err));
  };

  // 🔹 Detect Mood
  const detect = async () => {
    if (!videoRef.current) return;

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    // ❌ No face detected
    if (!detections.length) {
      alert("No face detected 😢");
      return;
    }

    const expressions = detections[0].expressions;

    const maxExpr = Object.entries(expressions)
      .sort((a, b) => b[1] - a[1])[0][0];

    const mood = maxExpr.toLowerCase();

    setDetectedMood(mood);
    fetchSongsUsingAxios(mood);
  };

  // 🔹 Fetch Songs
  const fetchSongsUsingAxios = async (mood) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:3000/songs?mood=${mood}`
      );

      console.log("API Response:", response.data);

      // ✅ IMPORTANT (backend uses "song")
      setSongs(response.data.song || []);
    } catch (error) {
      console.error("Error fetching songs:", error);
      setSongs([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-purple-50 to-purple-100 min-h-screen p-6">

      {/* 🌟 Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-8 text-center">
        Mood Song Predictor
      </h1>

      {/* 🎥 Video */}
      {/* make the border rounded */}
      <div className="relative mb-6">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          width="340"
          height="380"
          border-radius="20px"
          className="rounded-3xl shadow-2xl border-4 border-purple-400"

          
        />

        {detectedMood && (
          <div className="absolute top-3 left-3 px-4 py-2 bg-purple-600 text-white rounded-full">
            Mood: {detectedMood}
          </div>
        )}
      </div>

      {/* 🔍 Button */}
      <button
        onClick={detect}
        className="px-8 py-3 bg-purple-600 text-white rounded-xl mb-6"
      >
        Detect Mood
      </button>

      {/* ⏳ Loading */}
      {loading && <p>Loading songs...</p>}

      {/* 🎵 Songs */}
      <div className="w-full max-w-3xl space-y-4">
        {!loading && songs.length === 0 && (
          <p className="text-gray-500 text-center">
            No songs found...
          </p>
        )}

        {songs.map((song) => (
          <div
            key={song._id}
            className="p-4 bg-white rounded-xl shadow-md"
          >
            <h3 className="text-xl font-bold">{song.title}</h3>

            {song.artist && (
              <p className="text-gray-600">Artist: {song.artist}</p>
            )}

            {song.mood && (
              <p className="text-sm text-purple-600">
                Mood: {song.mood}
              </p>
            )}

            {/* ✅ Safe audio render */}
            {song.audio && (
              <audio controls src={song.audio} className="mt-2 w-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}