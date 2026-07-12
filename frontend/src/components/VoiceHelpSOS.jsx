import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import {
  dialHelpline,
  triggerVoiceHelpEmergency,
} from "../services/emergencyService";
import { startLiveLocationSharing } from "../services/liveLocationClient";

export default function VoiceHelpSOS({ onTriggered }) {
  const [listening, setListening] = useState(false);
  const [helpCount, setHelpCount] = useState(0);
  const [status, setStatus] = useState("Say “help” three times to auto-call nearest police.");
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const helpTimestampsRef = useRef([]);
  const triggeringRef = useRef(false);

  const resetHelpCounter = () => {
    helpTimestampsRef.current = [];
    setHelpCount(0);
  };

  const handleVoiceTrigger = async () => {
    if (triggeringRef.current) return;
    triggeringRef.current = true;
    setStatus("Help detected! Alerting nearest police with your live location...");
    setListening(false);
    listeningRef.current = false;
    recognitionRef.current?.stop();

    try {
      const result = await triggerVoiceHelpEmergency();
      startLiveLocationSharing(result.alert._id);
      onTriggered?.(result);
      dialHelpline(result.dialNumber);
      setStatus(
        `Calling ${result.helpline.name} — your live GPS is being shared with responders.`
      );
      resetHelpCounter();
    } catch (err) {
      setStatus(err.message || "Voice SOS failed. Please use Call Now.");
      resetHelpCounter();
    } finally {
      triggeringRef.current = false;
    }
  };

  const registerHelp = () => {
    const now = Date.now();
    helpTimestampsRef.current = helpTimestampsRef.current.filter(
      (time) => now - time < 15000
    );
    helpTimestampsRef.current.push(now);
    setHelpCount(helpTimestampsRef.current.length);

    if (helpTimestampsRef.current.length >= 3) {
      handleVoiceTrigger();
    } else {
      setStatus(`Detected “help” ${helpTimestampsRef.current.length}/3 — keep calling for help.`);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Voice SOS needs Chrome/Edge with microphone permission.");
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        if (/\bhelp\b/.test(transcript)) {
          registerHelp();
        }
      }
    };

    recognition.onerror = () => {
      setStatus("Voice listening error. Tap the button to retry.");
      setListening(false);
      listeningRef.current = false;
    };

    recognition.onend = () => {
      if (listeningRef.current) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setStatus("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      listeningRef.current = false;
      setStatus("Voice SOS paused.");
      resetHelpCounter();
      return;
    }

    resetHelpCounter();
    recognitionRef.current.start();
    setListening(true);
    listeningRef.current = true;
    setStatus("Listening… shout “help help help” if you are in danger.");
  };

  return (
    <div className="voice-sos-panel">
      <div className="voice-sos-header">
        <span className="voice-sos-icon">
          <FontAwesomeIcon icon={faShieldHalved} />
        </span>
        <div>
          <h4>Voice SOS — Shout “Help”</h4>
          <p>{status}</p>
        </div>
      </div>

      <div className="voice-sos-meter">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={`voice-sos-dot ${helpCount >= step ? "active" : ""}`}
          />
        ))}
        <span className="voice-sos-count">{helpCount}/3</span>
      </div>

      <button
        type="button"
        className={`btn ${listening ? "btn-danger" : "btn-primary"} btn-with-icon voice-sos-btn`}
        onClick={toggleListening}
      >
        <FontAwesomeIcon icon={listening ? faMicrophoneSlash : faMicrophone} />
        {listening ? "Stop Listening" : "Start Voice SOS"}
      </button>
    </div>
  );
}
