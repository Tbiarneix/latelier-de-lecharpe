"use client";

import { createAuthClient } from "better-auth/react";

// Même origine que le site : pas de baseURL à configurer.
export const authClient = createAuthClient();
