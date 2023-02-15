from flask import Flask, render_template, request, redirect
import mysql.connector
from flask import url_for
import sys

app = Flask(__name__)

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


@app.route('/choose_questions', methods=['GET', 'POST'])
def choose_questions():
    try:
        if request.method == 'POST':
            # fetch form data
            query = f"select question from questions where status = 'publish'  and category = 'Chapter{request.form['submit_button']}' ORDER by RAND() LIMIT 1"
            return redirect(url_for('display_questions', query=query))

    except mysql.connector.Error as error:
        return "Failed to create due to this error: " + repr(error)

    return render_template('choose_questions.html')


@app.route('/display_questions/<query>', methods=['GET', 'POST'])
def display_questions(query):
    print('display', file=sys.stderr)
    try:
        cursor.execute(query)
        res = cursor.fetchall()

        if request.method == 'POST':
            # fetch form data
            if request.form['submit_button'] == 'Back':
                # back to choosing topic page
                return redirect(url_for('choose_questions'))

            cursor.close()
    except mysql.connector.Error as error:
        return "Failed to create due to this error: " + repr(error)

    return render_template('display_questions.html', res=res)


if __name__ == '__main__':
    app.run(debug=True)
