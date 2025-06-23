import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1/claims";

export const claimService = {
  // Submit a new claim
  submitClaim: async ({ policyNumber, reason, documentFile }) => {
    try {
      const formData = new FormData();
      formData.append("policyNumber", policyNumber);
      formData.append("reason", reason);
      if (documentFile) {
        formData.append("document", documentFile);
      }

      const response = await axios.post(`${API_URL}/submit`, formData, {
        headers: {
          ...claimService.authHeader(),
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Claim submission failed" };
    }
  },

 

  // Update status of a claim
  updateClaimStatus: async (id, status) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}/status`,
        { status },
        {
          headers: claimService.authHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Updating claim status failed",
        }
      );
    }
  },

  // ✅ Fetch user claims
  getUserClaims: async () => {
    try {
      const response = await axios.get(`${API_URL}/my-claims`, {
        headers: claimService.authHeader(),
      });
      return response.data.data; // Return array of claims
    } catch (error) {
      throw error.response?.data || { message: "Fetching claims failed" };
    }
  },

  // Token & auth header helpers
  getToken: () => {
    return localStorage.getItem("token");
  },

  authHeader: () => {
    const token = claimService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
