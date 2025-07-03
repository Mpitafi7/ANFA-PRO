export async function InvokeLLM({ prompt, response_json_schema }) {
  // Demo: return a random message
  const messages = [
    { message: "Whoa, that's a long URL! 🚀" },
    { message: "Your link is hotter than Karachi in June! 🔥" },
    { message: "This URL is longer than a Karachi traffic jam! 🚗" },
    { message: "Time to make this URL as short as a Lahore winter! ❄️" },
    { message: "Let's shrink this link faster than chai gets cold! ☕" },
  ];
  const tips = [
    { tip: "Pro tip: Add UTM parameters to track your marketing campaigns like a boss! 📊" },
    { tip: "Did you know? Short links get 39% more clicks than long ones! 🚀" },
    { tip: "Custom aliases make your links more memorable than your favorite chai spot! ☕" },
    { tip: "Track your link performance to see what content resonates with your audience! 📈" },
    { tip: "Use descriptive custom aliases instead of random characters for better branding! ✨" },
  ];
  if (prompt.includes('tip')) {
    return tips[Math.floor(Math.random() * tips.length)];
  }
  return messages[Math.floor(Math.random() * messages.length)];
} 