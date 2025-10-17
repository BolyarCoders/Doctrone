import google.generativeai as genai
import os

from dotenv import load_dotenv

from flask import Flask, request, jsonify
app = Flask(__name__)


load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel(model_name="gemini-2.5-flash")

drugs = "aspirin, paracetamol"
intake = "2 times a day"
dosage = "500mg"
sex = "male"
age = "17 years old"

system_instruction = (
    f"You are DoctroneAI. Your goal is to assist users by providing medical information and advice. "
    f"If the patient reports any issues or symptoms, evaluate them considering the following details: "
    f"current medications ({drugs}), intake frequency ({intake}), dosage ({dosage}), gender ({sex}), and age ({age}). "
    "Be concise and clear in your responses."
)

@app.post("/chat")
def chat_endpoint():
    user_input = request.json.get("message", "")

    chat = model.start_chat(history=[{"role": "user","parts": [system_instruction],}])
    result = chat.send_message({"parts": [user_input]})

    print(result.text)
    return jsonify({"response": result.text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)