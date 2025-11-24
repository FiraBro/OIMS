// helper to set cookie
export const setRefreshCookie = (res, token, ttlMs) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ttlMs,
  });
};
