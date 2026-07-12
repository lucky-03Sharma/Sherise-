import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function ComplaintCard({ data, showDelete = false, onDelete }) {
  const initials = (data.type || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hasMedia =
    (data.images && data.images.length > 0) ||
    (data.videos && data.videos.length > 0) ||
    data.voiceNote;

  return (
    <div className="complaint-card">
      <div className="complaint-top">
        <div className="complaint-top-info">
          <span className="complaint-avatar">{initials}</span>
          <div>
            <h4 className="complaint-type">{data.type}</h4>
            <span className="complaint-date">
              {new Date(data.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <span className="complaint-status">Active</span>
      </div>

      <div className="complaint-content">
        <div className="complaint-row">
          <span className="label">Name</span>
          <span>{data.name}</span>
        </div>

        <div className="complaint-row">
          <span className="label">Location</span>
          <span>{data.location}</span>
        </div>

        {data.latitude && data.longitude && (
          <div className="complaint-row">
            <span className="label">GPS</span>
            <span>
              {data.latitude.toFixed?.(5) ?? data.latitude},{" "}
              {data.longitude.toFixed?.(5) ?? data.longitude}
            </span>
          </div>
        )}

        <div className="complaint-description">
          <h6>Description</h6>
          <p>{data.description}</p>
        </div>

        {hasMedia && (
          <div className="complaint-media-block">
            <h6>Evidence</h6>
            <div className="complaint-media-grid">
              {(data.images || []).map((src) => (
                <img key={src} src={src} alt="Complaint evidence" />
              ))}
              {(data.videos || []).map((src) => (
                <video key={src} src={src} controls />
              ))}
            </div>
            {data.voiceNote && (
              <audio className="complaint-voice-note" src={data.voiceNote} controls />
            )}
          </div>
        )}
      </div>

      {showDelete && (
        <div className="complaint-footer">
          <button
            className="btn btn-danger btn-with-icon"
            onClick={() => onDelete(data._id)}
          >
            <FontAwesomeIcon icon={faTrashCan} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
