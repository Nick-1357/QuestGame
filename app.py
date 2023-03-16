from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = b'\xfbT\x93\xc1\xf844\xd6}\xb1\xd1\xf0~\xec\xa5\xe1'
import question_extraction


if __name__ == '__main__':
    app.run(port=8000, debug=True)