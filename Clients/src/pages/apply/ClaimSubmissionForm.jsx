import React, { useState } from "react";
import { claimService } from "../../services/claimService";

const ClaimSubmissionForm = () => {
  const [policyNumber, setPolicyNumber] = useState("");
  const [reason, setReason] = useState("");
  const [document, setDocument] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!policyNumber || !reason || !document) {
      return setMessage("⚠️ Please fill all fields and upload a document.");
    }

    try {
      const res = await claimService.submitClaim({
        policyNumber,
        reason,
        documentFile: document,
      });
      setMessage("✅ " + res.message);
      setPolicyNumber("");
      setReason("");
      setDocument(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.message || "Submission failed"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Submit a Claim</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Policy Number"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Reason for claim"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
        <input
          type="file"
          onChange={(e) => setDocument(e.target.files[0])}
          className="w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Claim
        </button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default ClaimSubmissionForm;
