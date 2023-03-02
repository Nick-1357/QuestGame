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


@app.route('/', methods=['GET', 'POST'])
@app.route('/choose_questions', methods=['GET', 'POST'])
def choose_questions():
    try:
        if request.method == 'POST':
            # fetch form data
            # query = f"select id, qtype, question from questions where status = 'publish'  and category = 'Chapter{request.form['submit_button']}' ORDER by RAND() LIMIT 1"
            query = f"select id, qtype, question from questions where id=1081"

            try:
                cursor.execute(query)
                res = cursor.fetchall()[0]
            except mysql.connector.Error as error:
                return "Failed to create due to this error: " + repr(error)
            
            session["qid"] = res[0]
            session["qtype"] = res[1]
            session["question"] = res[2]
            return redirect(url_for('display_questions'))

    except mysql.connector.Error as error:
        print("Failed to create due to this error: " + repr(error))

    return render_template('choose_questions.html')


@app.route('/display_questions', methods=['GET', 'POST'])
def display_questions():
    question = preprocess_question(session["question"])

    hint = ""
    choices = []
    if session["qtype"].lower() == "mc":
        choices = retrieve_choices(session["qid"])
    
    request_body = {"question": question, "hint": hint, "choices": choices}
    
    if request.method == 'POST':
        # fetch form data
        if request.form['submit_button'] == 'hint':
            # generate hint
            hint = chatgpt.generate_hint(question[0][0])
        elif request.form['submit_button'] == 'back':
            # back to choosing topic page
            return redirect(url_for('choose_questions'))

    return render_template('display_questions.html', **request_body)


def preprocess_question(question):
    # define replacements
    rep = {'<pre class="ITS_Equation">': "", "</pre>": "", "<latex>": "$$", "</latex>": "$$"}  

    rep = dict((re.escape(k), v) for k, v in rep.items())
    pattern = re.compile("|".join(rep.keys()))
    question = str(BeautifulSoup(question, "lxml"))
    return pattern.sub(lambda m: rep[re.escape(m.group(0))], question)

def retrieve_choices(id):
    choices = [f"answer{x}" for x in range(1, 10)]
    query = "select " + ", ".join(choices) + f" from questions_mc where questions_id = {id}"
    
    try:
        cursor.execute(query)
        res = [BeautifulSoup(choice, "lxml") for choice in cursor.fetchall()[0] if choice]
    except mysql.connector.Error as error:
        print("Failed to create due to this error: " + repr(error))
    
    return res