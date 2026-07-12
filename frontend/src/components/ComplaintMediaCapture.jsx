import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import RecordRTC from "recordrtc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faImage,
  faLocationDot,
  faMicrophone,
  faStop,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { getCurrentPosition } from "../services/emergencyService";

export default function ComplaintMediaCapture({ onMediaChange }) {
  const webcamRef = useRef(null);
  const recorderRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [media, setMedia] = useState({
    imageFiles: [],
    videoFiles: [],
    voiceBlob: null,
    latitude: "",
    longitude: "",
    gpsLabel: "",
  });

  const notify = useCallback(
    (next) => {
      setMedia(next);
      onMediaChange?.(next);
    },
    [onMediaChange]
  );

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    notify({ ...media, imageFiles: [...media.imageFiles, ...files] });
    e.target.value = "";
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    notify({ ...media, videoFiles: [...media.videoFiles, ...files] });
    e.target.value = "";
  };

  const capturePhoto = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) return;

    fetch(screenshot)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `webcam-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        notify({ ...media, imageFiles: [...media.imageFiles, file] });
        setShowWebcam(false);
      });
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
      });
      recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access to record a voice message.");
    }
  };

  const stopVoiceRecording = () => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current.getBlob();
      recorderRef.current.destroy();
      recorderRef.current = null;
      setIsRecording(false);
      notify({ ...media, voiceBlob: blob });
    });
  };

  const useMyLocation = async () => {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      notify({
        ...media,
        latitude: String(latitude),
        longitude: String(longitude),
        gpsLabel: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
      });
    } catch (err) {
      alert("Unable to get GPS location. Please allow location access.");
    }
  };

  return (
    <div className="media-capture">
      <h6 className="media-capture-title">Evidence &amp; Location (optional)</h6>

      <div className="media-actions">
        <label className="media-btn">
          <FontAwesomeIcon icon={faImage} />
          Upload Images
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageUpload}
          />
        </label>

        <label className="media-btn">
          <FontAwesomeIcon icon={faVideo} />
          Upload Videos
          <input
            type="file"
            accept="video/*"
            multiple
            hidden
            onChange={handleVideoUpload}
          />
        </label>

        <button
          type="button"
          className="media-btn"
          onClick={() => setShowWebcam((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faCamera} />
          Webcam Photo
        </button>

        {!isRecording ? (
          <button type="button" className="media-btn" onClick={startVoiceRecording}>
            <FontAwesomeIcon icon={faMicrophone} />
            Record Voice
          </button>
        ) : (
          <button type="button" className="media-btn media-btn--danger" onClick={stopVoiceRecording}>
            <FontAwesomeIcon icon={faStop} />
            Stop Recording
          </button>
        )}

        <button type="button" className="media-btn" onClick={useMyLocation}>
          <FontAwesomeIcon icon={faLocationDot} />
          Use GPS Location
        </button>
      </div>

      {showWebcam && (
        <div className="webcam-panel">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="webcam-feed"
            videoConstraints={{ facingMode: "user" }}
          />
          <button type="button" className="btn btn-primary btn-sm mt-2" onClick={capturePhoto}>
            Capture Photo
          </button>
        </div>
      )}

      <div className="media-summary">
        {media.imageFiles.length > 0 && (
          <p>{media.imageFiles.length} image(s) attached</p>
        )}
        {media.videoFiles.length > 0 && (
          <p>{media.videoFiles.length} video(s) attached</p>
        )}
        {media.voiceBlob && <p>Voice message recorded</p>}
        {media.gpsLabel && <p>GPS: {media.gpsLabel}</p>}
      </div>
    </div>
  );
}
