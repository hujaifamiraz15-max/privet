import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    improvement: "",
    decline: "",
    targetRole: "",
    circleRole: "",
    monova: "",
    remarks: "",
  });
  const [editingMember, setEditingMember] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);

  // Grade options
  const gradeOptions = [
    "সমর্থক",
    "কর্মী",
    "সাথী",
    "সদস্য",
    "বিদ্বেষী",
    "বাম",
    "ছাত্রদল",
    "ছাত্র ইউনিয়ন",
    "ছাত্রলীগ",
    "পীরপন্থী",
    "অন্যমনস্ক",
    "বখাটে",
    "মেধাবী",
    "সংশয়বাদী",
  ];

  // Target role options
  const targetRoleOptions = [
    "সমর্থক",
    "কর্মী",
    "সাথী",
    "সদস্য",
    "বিদ্বেষী",
    "বাম",
    "ছাত্রদল",
    "ছাত্র ইউনিয়ন",
    "ছাত্রলীগ",
    "পীরপন্থী",
    "অন্যমনস্ক",
    "বখাটে",
    "মেধাবী",
    "সংশয়বাদী",
  ];

  // Circle role options
  const circleRoleOptions = [
   "সমর্থক",
    "কর্মী",
    "সাথী",
    "সদস্য",
    "বিদ্বেষী",
    "বাম",
    "ছাত্রদল",
    "ছাত্র ইউনিয়ন",
    "ছাত্রলীগ",
    "পীরপন্থী",
    "অন্যমনস্ক",
    "বখাটে",
    "মেধাবী",
    "সংশয়বাদী",
  ];

  // Monova options
  const monovaOptions = [
    "সমর্থক",
    "কর্মী",
    "সাথী",
    "সদস্য",
    "বিদ্বেষী",
    "বাম",
    "ছাত্রদল",
    "ছাত্র ইউনিয়ন",
    "ছাত্রলীগ",
    "পীরপন্থী",
    "অন্যমনস্ক",
    "বখাটে",
    "মেধাবী",
    "সংশয়বাদী",
    "উচ্চ প্রেরণা",
    "স্থিতিস্থাপক",
    "উদ্যোগী",
    "সহযোগিতাপরায়ণ",
    "কৌশলী মস্তিষ্ক",
    "টিম প্লেয়ার",
    "লিডারশিপ মানসিকতা",
    "বিশ্লেষণধর্মী",
    "সৃজনশীল সংগঠক",
    "শৃঙ্খলাবদ্ধ যোদ্ধা",
  ];

  // Fetch members
  useEffect(() => {
    fetchMembers();
  }, [currentPage]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`/api/members?page=${currentPage}`);
      setMembers(response.data.members);
      setTotalPages(response.data.totalPages);
      setTotalMembers(response.data.total);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await axios.put(`/api/members/${editingMember._id}`, formData);
      } else {
        await axios.post("/api/members", formData);
      }

      // Reset form
      setFormData({
        name: "",
        grade: "",
        improvement: "",
        decline: "",
        targetRole: "",
        circleRole: "",
        monova: "",
        remarks: "",
      });
      setEditingMember(null);
      fetchMembers();
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  // Handle edit
  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      grade: member.grade,
      improvement: member.improvement,
      decline: member.decline,
      targetRole: member.targetRole,
      circleRole: member.circleRole,
      monova: member.monova,
      remarks: member.remarks,
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await axios.delete(`/api/members/${id}`);
        fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header Section */}
      <div className="header-section">
        <div className="title-row">
          <h1>
            📊 ইসলামী ছাত্রশিবির সাইফুল ইসলাম মামুন আরবি ভাষা ও সাহিত্য বিভাগের ২২-২৩ শিক্ষাবর্ষের সকল ছাত্রদের রিপোর্ট এনালাইসিস।
            <small>উন্নতি-অবনতি বিশ্লেষণ</small>
          </h1>
          <div className="stats-badge">👥 মোট সদস্য: {totalMembers} জন</div>
        </div>
        <div className="sub-header">
          🔹 রোল ভিত্তিক মূল্যায়ন | কে কে টার্গেটে নিয়েছে তার রোল | সার্কেল
          রোল | মনোভা ও মন্তব্য সংবলিত প্রতিবেদন।
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>নাম</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>মান (পদ/মান)</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
              >
                <option value="">নির্বাচন করুন</option>
                {gradeOptions.map((grade, index) => (
                  <option key={index} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>উন্নতি %</label>
              <input
                type="number"
                name="improvement"
                value={formData.improvement}
                onChange={handleInputChange}
                min="0"
                max="100"
                required
              />
            </div>
            <div className="form-group">
              <label>অবনতি %</label>
              <input
                type="number"
                name="decline"
                value={formData.decline}
                onChange={handleInputChange}
                min="0"
                max="100"
                required
              />
            </div>
            <div className="form-group">
              <label>কে কে টার্গেটে নিয়েছে তার রোল</label>
              <select
                name="targetRole"
                value={formData.targetRole}
                onChange={handleInputChange}
                required
              >
                <option value="">নির্বাচন করুন</option>
                {targetRoleOptions.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>সার্কেল রোল</label>
              <select
                name="circleRole"
                value={formData.circleRole}
                onChange={handleInputChange}
                required
              >
                <option value="">নির্বাচন করুন</option>
                {circleRoleOptions.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>মনোভা</label>
              <select
                name="monova"
                value={formData.monova}
                onChange={handleInputChange}
                required
              >
                <option value="">নির্বাচন করুন</option>
                {monovaOptions.map((monova, index) => (
                  <option key={index} value={monova}>
                    {monova}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>মন্তব্য</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            {editingMember ? "আপডেট করুন" : "সদস্য যোগ করুন"}
          </button>
          {editingMember && (
            <button
              type="button"
              className="btn btn-danger"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                setEditingMember(null);
                setFormData({
                  name: "",
                  grade: "",
                  improvement: "",
                  decline: "",
                  targetRole: "",
                  circleRole: "",
                  monova: "",
                  remarks: "",
                });
              }}
            >
              বাতিল করুন
            </button>
          )}
        </form>
      </div>

      {/* Table Section */}
      <div className="table-responsive">
        <table className="performance-table">
          <thead>
            <tr>
              <th>ক্রমিক</th>
              <th>নাম</th>
              <th>
                মান
                <br />
                পদ/মান
              </th>
              <th>উন্নতি %</th>
              <th>অবনতি %</th>
              <th>কে কে টার্গেটে নিয়েছে তার রোল</th>
              <th>সার্কেল রোল</th>
              <th>মনোভা</th>
              <th>মন্তব্য</th>
              <th>অ্যাকশন</th>
            </tr>
            <tr style={{ background: "#eef3fc;" }}>
              <th
                colSpan="10"
                style={{
                  textAlign: "left",
                  fontWeight: "normal",
                  fontSize: "0.68rem",
                  padding: "6px 12px;",
                }}
              >
                📌 সাংগঠনিক কাঠামো অনুযায়ী প্রতিটি কর্মীর রোল, টার্গেট
                অ্যাসাইনমেন্ট ও সার্কেল রোল নির্ধারিত হয়েছে
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member._id}>
                <td className="serial-cell">
                  {(currentPage - 1) * 10 + index + 1}
                </td>
                <td>{member.name}</td>
                <td
                  style={{
                    fontWeight: "500",
                    background: "#f0f5fa",
                    borderRadius: "20px",
                  }}
                >
                  {member.grade}
                </td>
                <td>
                  <span className="progress-up">📈 {member.improvement}%</span>
                </td>
                <td>
                  <span className="progress-down">📉 {member.decline}%</span>
                </td>
                <td>
                  <span
                    className="target-badge"
                    style={{ fontSize: "0.75rem" }}
                  >
                    🎯 {member.targetRole}
                  </span>
                </td>
                <td>
                  <span className="circle-role">🔄 {member.circleRole}</span>
                </td>
                <td>
                  <span className="monova-tag">🧠 {member.monova}</span>
                </td>
                <td>
                  <div className="comment-text">💬 {member.remarks}</div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleEdit(member)}
                    >
                      সম্পাদনা
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(member._id)}
                    >
                      মুছুন
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          পূর্ববর্তী
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          পরবর্তী
        </button>
      </div>

      {/* Footer */}
      <div className="footer-meta">
        <span>
          ✅ প্রতিটি সদস্যের জন্য টার্গেট রোল, সার্কেল দায়িত্ব ও মনোভা
          (মেন্টালিটি) সংযোজিত হয়েছে।
        </span>
        <span>
          📈 উন্নতি% ও অবনতি% সাম্প্রতিক মূল্যায়ন সূচক অনুযায়ী নির্ধারিত।
        </span>
      </div>
    </div>
  );
};

export default App;
