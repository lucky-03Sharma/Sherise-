import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faClipboardList,
  faComments,
  faFolderOpen,
  faPhone,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import API from "../services/api";
import Navbar from "../components/Navbar";
import IconCircle from "../components/IconCircle";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/pages-common.css";
import "../css/dashboard.css";

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    complaints: 0,
    myComplaints: 0,
    therapySessions: 0,
    consultations: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name") || localStorage.getItem("username");
    setUserName(name || "there");

    const fetchData = async () => {
      try {
        const [allRes, myRes, therapyRes, consultRes] = await Promise.allSettled([
          API.get("/complaints"),
          API.get("/complaints/my"),
          API.get("/therapy/my"),
          API.get("/consultations/my"),
        ]);

        const complaints =
          allRes.status === "fulfilled" ? allRes.value.data.complaints || [] : [];
        const myComplaints =
          myRes.status === "fulfilled" ? myRes.value.data || [] : [];
        const therapySessions =
          therapyRes.status === "fulfilled"
            ? therapyRes.value.data.sessions || []
            : [];
        const consultations =
          consultRes.status === "fulfilled"
            ? consultRes.value.data.consultations || []
            : [];

        setStats({
          complaints: complaints.length,
          myComplaints: myComplaints.length,
          therapySessions: therapySessions.length,
          consultations: consultations.length,
        });

        setRecentComplaints(myComplaints.slice(0, 3));
      } catch (err) {
        console.log("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const quickLinks = [
    {
      to: "/complaints",
      icon: faClipboardList,
      label: "File Complaint",
      desc: "Report an incident securely",
    },
    {
      to: "/therapy",
      icon: faUserDoctor,
      label: "Book Therapy",
      desc: "Schedule with a therapist",
    },
    {
      to: "/consultation",
      icon: faComments,
      label: "Consult Expert",
      desc: "Get professional guidance",
    },
    {
      to: "/helplines",
      icon: faPhone,
      label: "Helplines",
      desc: "24/7 emergency support",
    },
  ];

  return (
    <div className="app-page dashboard-page">
      <Navbar />

      <div className="page-main">
        <div className="dashboard-hero">
          <h1 className="dashboard-greeting">{t("Welcome back")}, {userName}!</h1>
          <p className="dashboard-tagline">
            {t("Your safe space for support, reporting, and healing.")}
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">
              <IconCircle icon={faClipboardList} />
            </span>
            <div className="stat-info">
              <span className="stat-number">{stats.myComplaints}</span>
              <span className="stat-label">{t("My Complaints")}</span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              <IconCircle icon={faFolderOpen} />
            </span>
            <div className="stat-info">
              <span className="stat-number">{stats.complaints}</span>
              <span className="stat-label">{t("Total Reports")}</span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              <IconCircle icon={faUserDoctor} />
            </span>
            <div className="stat-info">
              <span className="stat-number">{stats.therapySessions}</span>
              <span className="stat-label">{t("Therapy Sessions")}</span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              <IconCircle icon={faComments} />
            </span>
            <div className="stat-info">
              <span className="stat-number">{stats.consultations}</span>
              <span className="stat-label">{t("Consultations")}</span>
            </div>
          </div>
        </div>

        <h3 className="dashboard-section-title">{t("Quick Actions")}</h3>
        <div className="quick-links-grid">
          {quickLinks.map((link) => (
            <Link to={link.to} className="quick-link-card" key={link.to}>
              <span className="quick-link-icon">
                <IconCircle icon={link.icon} />
              </span>
              <div>
                <h4>{t(link.label)}</h4>
                <p>{t(link.desc)}</p>
              </div>
            </Link>
          ))}
        </div>

        {recentComplaints.length > 0 && (
          <>
            <h3 className="dashboard-section-title">Recent Complaints</h3>
            <div className="recent-list">
              {recentComplaints.map((c) => (
                <div className="recent-item" key={c._id}>
                  <div className="recent-item-header">
                    <span className="recent-type">{c.type}</span>
                    <span className="recent-date">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="recent-desc">{c.description}</p>
                </div>
              ))}
            </div>
            <Link to="/complaints" className="view-all-link">
              View all complaints
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
