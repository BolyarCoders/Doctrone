// app/login/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function LoginLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,          // Hide the default header
        contentStyle: { backgroundColor: "#ffffff" },
        animation: "slide_from_right", // Optional: nice slide animation
      }}
    >
      {/* Screens inside login folder */}
      <Stack.Screen name="index" />             {/* app/login/index.tsx */}
      <Stack.Screen name="login" />             {/* app/login/login.tsx */}
      <Stack.Screen name="optionsRegister" />   {/* app/login/optionsRegister.tsx */}
      <Stack.Screen name="register" />          {/* app/login/register.tsx */}
    </Stack>
  );
}