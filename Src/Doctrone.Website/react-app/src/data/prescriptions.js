const mockPrescriptions = [
  {
    id: 1,
    title: "Anxiety Syndrome Assessment",
    status: "active",
    messages: [
      {
        role: "user",
        content: "I've been feeling anxious and having trouble sleeping.",
      },
      {
        role: "assistant",
        content:
          "I understand. Let's assess your symptoms. Can you describe when these feelings started?",
      },
      { role: "user", content: "About 3 weeks ago, after starting a new job." },
      {
        role: "assistant",
        content:
          "Based on your symptoms, this could be adjustment-related anxiety. I recommend: 1) Regular sleep schedule, 2) Mindfulness exercises, 3) Consider speaking with a therapist.",
      },
    ],
  },
  {
    id: 2,
    title: "Migraine Pattern Analysis",
    status: "active",
    messages: [
      {
        role: "user",
        content: "I get severe headaches with light sensitivity.",
      },
      {
        role: "assistant",
        content:
          "These symptoms suggest migraines. Let's identify triggers. How often do these occur?",
      },
    ],
  },
  {
    id: 3,
    title: "Digestive Issues Check",
    status: "other",
    messages: [
      { role: "user", content: "I have stomach pain after eating." },
      {
        role: "assistant",
        content: "Let's explore this. What foods trigger the pain?",
      },
    ],
  },
  {
    id: 4,
    title: "Sleep Disorder Evaluation",
    status: "other",
    messages: [
      { role: "user", content: "I wake up multiple times at night." },
      {
        role: "assistant",
        content:
          "Sleep fragmentation can have various causes. Tell me about your bedtime routine.",
      },
    ],
  },
];
export default mockPrescriptions;
