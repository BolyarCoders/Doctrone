import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from supabase import create_client, Client

app = Flask(__name__)

# Load .env variables
load_dotenv()

# Configure Gemini
genai.configure(api_key="AIzaSyBzMQutGJnduWwKcTrmvAvP_QiTj8zaJ3I")
model = genai.GenerativeModel(model_name="gemini-2.5-flash")

# Configure Supabase
SUPABASE_URL = "https://vhssvvlsgoprgizbckea.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc3N2dmxzZ29wcmdpemJja2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzgxNzIsImV4cCI6MjA3NjMxNDE3Mn0.ztzSA5TXSQA9Cjz-T9YBkpzjW2e07JajSHhVQApECYY"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_user_info(user_id):
    user_response = supabase.table("users").select("*").eq("id", user_id).execute()
    if not user_response.data:
        return None

    user = user_response.data[0]
    sex = user.get("gender", "not specified")
    age = user.get("age", "not specified")

    prescriptions = supabase.table("prescriptions").select("*").eq("user_id", user_id).execute().data

    drugs_info = []
    for prescription in prescriptions:
        drug_id = prescription.get("drug_id")
        drug_data = supabase.table("drugs").select("name").eq("id", drug_id).execute().data
        drug_name = drug_data[0]["name"] if drug_data else "Unknown drug"

        intake = prescription.get("intake", "not specified")
        dosage = prescription.get("dosage", "not specified")

        drugs_info.append(f"{drug_name} ({dosage}, {intake})")

    drugs_summary = ", ".join(drugs_info) if drugs_info else "no current medications"
    return drugs_summary, sex, age


def get_gemini_response(user_input: str, drugs_summary: str, sex: str, age: str) -> str:
    system_instruction = (
        f"You are DoctroneAI. Your goal is to assist users by providing medical information and advice. "
        f"If the patient reports any issues or symptoms, evaluate them considering the following details: "
        f"current medications ({drugs_summary}), gender ({sex}), and age ({age}). "
        "If the user is asking about a medication or drug, provide information based on their current prescriptions. "
        "At the end, also mention whether the medication is suitable for driving or operating heavy machinery. "
        "Be concise and clear in your responses."
    )

    chat = model.start_chat(history=[{"role": "user", "parts": [system_instruction]}])
    result = chat.send_message({"parts": [user_input]})
    return result.text



@app.post("/new_chat")
def new_chat():
    data = request.json
    user_id = data.get("user_id")
    user_input = data.get("message", "")

    user_info = get_user_info(user_id)
    if not user_info:
        return jsonify({"error": "User not found"}), 404

    drugs_summary, sex, age = user_info
    response_text = get_gemini_response(user_input, drugs_summary, sex, age)

    # Create new chat record
    chat = supabase.table("chats").insert({"user_id": user_id}).execute()
    chat_id = chat.data[0]["id"]

    # Add first messages (user + AI)
    supabase.table("messages").insert([
        {"chat_id": chat_id, "sender": "user", "content": user_input},
        {"chat_id": chat_id, "sender": "ai", "content": response_text},
    ]).execute()

    print(f"🆕 New chat created: {chat_id}")
    print(f"User: {user_input}")
    print(f"AI: {response_text}")

    return jsonify({"chat_id": chat_id, "response": response_text})


@app.post("/chat")
def continue_chat():
    data = request.json
    user_id = data.get("user_id")
    chat_id = data.get("chat_id")
    user_input = data.get("message", "")

    if not chat_id:
        return jsonify({"error": "chat_id is required"}), 400

    user_info = get_user_info(user_id)
    if not user_info:
        return jsonify({"error": "User not found"}), 404

    drugs_summary, sex, age = user_info
    response_text = get_gemini_response(user_input, drugs_summary, sex, age)

    # Add messages to existing chat
    supabase.table("messages").insert([
        {"chat_id": chat_id, "sender": "user", "content": user_input},
        {"chat_id": chat_id, "sender": "ai", "content": response_text},
    ]).execute()

    print(f"User ({chat_id}): {user_input}")
    print(f"AI: {response_text}")

    return jsonify({"chat_id": chat_id, "response": response_text})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)