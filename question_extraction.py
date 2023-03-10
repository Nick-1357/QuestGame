import json
from flask import Flask, render_template, request, redirect, url_for, session
from app import app
import mysql.connector
from flask import url_for
import sys
import chatgpt
import re
from bs4 import BeautifulSoup


myDb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    port="3306",
    database="ITS"
)

cursor = myDb.cursor()
if (myDb.is_connected()):
    print("Connected")
else:
    print("Not connected")



@app.route('/api/extract_question', methods=['GET', 'POST'])
def extract_question():
    
    id = int(request.args.get("id"))
    if id == -1:
        return {}
    
    #select random for now
    query = f"select qtype, question from questions where status = 'publish' ORDER by RAND() LIMIT 1"

    try:
        cursor.execute(query)
        res = cursor.fetchall()[0]
    except mysql.connector.Error as error:
        return "Failed to create due to this error: " + repr(error)

    response = {}
    response["qtype"] = res[0].lower()
    response["question"] = preprocess_text(res[1])
    response["hint"] = ""

    # if response["qtype"] == "mc":
    #     response["choices"] = retrieve_choices(id)

    print(response)
    return response





@app.route('/display_questions', methods=['GET', 'POST'])
def display_questions():

    if request.method == 'POST':
        # fetch form data
        if request.form['submit_button'] == 'hint':
            # generate hint
            if not session["hint"]:
                if session["qtype"] == "mc":
                    session["hint"] = chatgpt.generate_hint_mc(
                        session["question"], session["choices"])

        elif request.form['submit_button'] == 'back':
            # back to choosing topic page
            return redirect(url_for('choose_questions'))

    request_body = {"question": session["question"],
                    "hint": session["hint"], "choices": session["choices"]}
    return render_template('display_questions.html', **request_body)


def preprocess_text(question):
    # define replacements
    rep = {'<pre class="ITS_Equation">': "",
           "</pre>": "", "<latex>": "$", "</latex>": "$"}

    rep = dict((re.escape(k), v) for k, v in rep.items())
    pattern = re.compile("|".join(rep.keys()))
    question = str(BeautifulSoup(question, "lxml"))
    return pattern.sub(lambda m: rep[re.escape(m.group(0))], question)


def retrieve_choices(id):
    choices = [f"answer{x}" for x in range(1, 10)]
    query = "select " + ", ".join(choices) + \
        f" from questions_mc where questions_id = {id}"

    try:
        cursor.execute(query)
        res = [str(BeautifulSoup(choice, "lxml"))
               for choice in cursor.fetchall()[0] if choice]
    except mysql.connector.Error as error:
        print("Failed to create due to this error: " + repr(error))

    return res
