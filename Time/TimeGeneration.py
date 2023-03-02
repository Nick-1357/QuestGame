import json
from flask import Flask, render_template, request, redirect, url_for, session
from app import app
import mysql.connector
from flask import url_for
import sys
import pandas as pd
import statistics

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

@app.route('/', methods = ['GET', 'POST'])
@app.route('/choose_questions', methods=['GET', 'POST'])
def choose_questions():
    try:
        if request.method == 'POST':
            # fetch form data
            query = f"select question,time, difficulty from questions where status = 'publish' ' ORDER by RAND() LIMIT 1"
            session["query"] = query
            return redirect(url_for('display_questions'))

    except mysql.connector.Error as error:
        return "Failed to create due to this error: " + repr(error)


@app.route('/display_questions', methods=['GET', 'POST'])
def display_questions():
    query = session["query"]
    questionData = pd.read_sql(query, myDb)
    timeAssociation(questionData)
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

def timeAssociation(queryResult):
    # timeAssociations = {}
    # for results in queryResult:
    #     if results.question in timeAssociations.keys():
    #         currentList = timeAssociations.get(results.question)[0]
    #         currentList.append(results.time)
    #         medianVal = statistics.median(currentList)
    #         timeAssociations[results.question] = [currentList, medianVal]
    #     else:
    #         timeAssociations[results.question] = [[results.time], results.time]
    queryResult = queryResult.groupby(['question']).median()
    print(queryResult)

            


if __name__ == '__main__':
    app.run(debug=True)
