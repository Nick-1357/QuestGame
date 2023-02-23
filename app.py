from flask import Flask, request, abort

app = Flask(__name__)
import question_extraction


if __name__ == '__main__':
    app.run(debug=True)