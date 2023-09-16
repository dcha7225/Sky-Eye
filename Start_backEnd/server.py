from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print("failed")
        return 'No file part'

    file = request.files['file']
    if file.filename == '':
        print("failed")
        return 'No selected file'
    print("passed")
    file.save('./' + file.filename)

    return 'File uploaded successfully'


if __name__ == '__main__':
    app.run()
