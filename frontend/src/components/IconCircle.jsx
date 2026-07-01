import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function IconCircle({ icon, className = "" }) {
  return (
    <span className={`icon-circle ${className}`.trim()} aria-hidden="true">
      <FontAwesomeIcon icon={icon} />
    </span>
  );
}
