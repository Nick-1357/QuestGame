from flask import Flask, request, jsonify
from revChatGPT.V1 import Chatbot
from app import app

def login():
    chatbot = Chatbot(config={
        "email": "hilos47603@laserlip.com",
        "password": "vipitschatgpt"
    })
    return chatbot



@app.route('/hint', methods=['GET'])
def hint():
    if request.method == 'GET':
        chatbot = login()
        prompt = "What is signal processing?"
        for data in chatbot.ask(prompt):
            response = data["message"]
        return response

# start the server
if __name__ == '__main__':
    app.run(debug=True)
