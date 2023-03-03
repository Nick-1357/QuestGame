from flask import Flask, request, jsonify, session
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
    prompt = "Generate a hint for the following question: " + \
        question + ". Surround MATLAB code with '<pre>' and '</pre>'. Surround LaTeX with '$$' and '$$'."
    for data in chatbot.ask(prompt):
        response = data["message"]

    return response


def generate_hint_mc(question, choices):
    chatbot = login()
    prompt = "Generate a hint for the following question: " + \
        question + ". Surround MATLAB code with '<pre>' and '</pre>'. Surround LaTeX with '$$' and '$$'." + \
        "Explain why the following choices are right or wrong, start each choice on a new line: " + \
        str(choices)
    for data in chatbot.ask(prompt):
        response = data["message"]

    return response
