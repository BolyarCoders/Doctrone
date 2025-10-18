import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from supabase import create_client, Client

app = Flask(__name__)

# Load .env variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("AIzaSyBzMQutGJnduWwKcTrmvAvP_QiTj8zaJ3I"))
model = genai.GenerativeModel(model_name="gemini-2.5-flash")

# Configure Supabase
SUPABASE_URL = os.getenv("https://vhssvvlsgoprgizbckea.supabase.co")
SUPABASE_KEY = os.getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc3N2dmxzZ29wcmdpemJja2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzgxNzIsImV4cCI6MjA3NjMxNDE3Mn0.ztzSA5TXSQA9Cjz-T9YBkpzjW2e07JajSHhVQApECYY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.post("/chat")
def chat_endpoint():
    data = request.json
    user_id = data.get("user_id")
    user_input = data.get("message", "")

    # === Fetch user data ===
    user_response = supabase.table("users").select("*").eq("id", user_id).execute()
    if not user_response.data:
        return jsonify({"error": "User not found"}), 404

    user = user_response.data[0]
    sex = user.get("gender", "not specified")
    age = user.get("age", "not specified")

    # === Fetch prescriptions for the user ===
    prescriptions = supabase.table("prescriptions").select("*").eq("user_id", user_id).execute().data

    drugs_info = []
    for prescription in prescriptions:
        drug_id = prescription.get("drug_id")
        drug_data = supabase.table("drugs").select("name").eq("id", drug_id).execute().data
        drug_name = drug_data[0]["name"] if drug_data else "Unknown drug"

        intake = prescription.get("intake", "not specified")
        dosage = prescription.get("dosage", "not specified")

        drugs_info.append(f"{drug_name} ({dosage}, {intake})")

    # Build context for Gemini
    drugs_summary = ", ".join(drugs_info) if drugs_info else "no current medications"

    system_instruction = (
        f"You are DoctroneAI. Your goal is to assist users by providing medical information and advice. "
        f"If the patient reports any issues or symptoms, evaluate them considering the following details: "
        f"current medications ({drugs_summary}), gender ({sex}), and age ({age}). "
        "Be concise and clear in your responses."
    )

    # === Generate response ===
    chat = model.start_chat(history=[{"role": "user", "parts": [system_instruction]}])
    result = chat.send_message({"parts": [user_input]})

    print("User:", user_input)
    print("AI:", result.text)

    return jsonify({"response": result.text})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)