import json
from flask import Flask, render_template, request, redirect, url_for, session
from app import app
import mysql.connector
from flask import url_for
import sys
import chatgpt
import re


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
            # query = f"select question from questions where status = 'publish'  and category = 'Chapter{request.form['submit_button']}' ORDER by RAND() LIMIT 1"
            query = "select question from questions where id = 1081"
            try:
                cursor.execute(query)
                question = cursor.fetchall()
            except mysql.connector.Error as error:
                return "Failed to create due to this error: " + repr(error)
            session["question"] = question
            return redirect(url_for('display_questions'))

    except mysql.connector.Error as error:
        return "Failed to create due to this error: " + repr(error)

    return render_template('choose_questions.html')


@app.route('/display_questions', methods=['GET', 'POST'])
def display_questions():
    question = session["question"][0][0]
    
    # define replacements
    rep = {'<PRE class=ITS_Equation>': "", '<PRE class="ITS_Equation">': "", '<pre class="ITS_Equation">': "", "</pre>": "",
           "</PRE>": "", "</sup>": "", "<latex>": "$$", "</latex>": "$$"}  

    rep = dict((re.escape(k), v) for k, v in rep.items())
    pattern = re.compile("|".join(rep.keys()))
    question = pattern.sub(lambda m: rep[re.escape(m.group(0))], question)
    hint = ""
    
    if request.method == 'POST':
        # fetch form data
        if request.form['submit_button'] == 'hint':
            # generate hint
            hint = chatgpt.generate_hint(question[0][0])
        elif request.form['submit_button'] == 'back':
            # back to choosing topic page
            return redirect(url_for('choose_questions'))

    return render_template('display_questions.html', question=question, hint=hint)


if __name__ == '__main__':
    app.run(debug=True)
