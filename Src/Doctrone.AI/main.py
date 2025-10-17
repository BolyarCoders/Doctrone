import google.generativeai as genai
import os

from dotenv import load_dotenv

load_dotenv()

os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_KEY")
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

model = genai.GenerativeModel(model_name="gemini-2.5-flash")

system_instruction = (
    "Вие сте Джарвис, полезен и информативен AI асистент. "
)

chat = model.start_chat(history=[{"role": "user","parts": [system_instruction],}])

user_input = "Какво е времето днес в София?"

result = chat.send_message({"parts": [user_input]})

print("Джарвис: ", result.text)