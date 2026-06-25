<form onSubmit={handleSubmit}>
  <input
    className="form-control mb-3"
    type="text"
    placeholder="Issue (e.g. workplace harassment)"
    value={form.issue}
    onChange={(e) =>
      setForm({ ...form, issue: e.target.value })
    }
  />

  <select
    className="form-select mb-3"
    value={form.category}
    onChange={(e) =>
      setForm({ ...form, category: e.target.value })
    }
  >
    <option value="">Select category</option>
    <option value="legal">Legal</option>
    <option value="mental">Mental</option>
    <option value="domestic">Domestic</option>
    <option value="harassment">Harassment</option>
  </select>

  <textarea
    className="form-control mb-3"
    rows="4"
    placeholder="Describe your problem"
    value={form.description}
    onChange={(e) =>
      setForm({ ...form, description: e.target.value })
    }
  />

  <button type="submit" disabled={loading}>
    {loading ? "Submitting..." : "Request Consultation"}
  </button>

  {showPopup && (
    <div
      className={`alert mt-3 ${
        message.includes("success")
          ? "alert-success"
          : "alert-danger"
      }`}
    >
      {message}
    </div>
  )}
</form>