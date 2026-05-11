// Centralised route table so links and redirects never hard-code path strings.
export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  projects: "/projects",
  project: (id: string) => `/projects/${id}`,
  profile: "/profile",
} as const;
