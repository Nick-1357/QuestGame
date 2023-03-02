from flask import Flask, request, jsonify
from revChatGPT.V1 import Chatbot
from app import app


def login():
    chatbot = Chatbot(config={
        "email": "hilos47603@laserlip.com",
        "password": "vipitschatgpt"
    })
    return chatbot


def generate_hint(question):
    chatbot = login()
    prompt = "Give me a hint for the following question: " + question + "and surround code with '<pre>' and '</pre>'."
    for data in chatbot.ask(prompt):
        response = data["message"]
    return response
    

