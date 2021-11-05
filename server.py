from flask import Flask, request, render_template
from NeuralNet import *
from PIL import Image
import numpy as np
import base64
from io import BytesIO
import json
import os

model = Model.load('models/PositiveDense.model')
app = Flask(__name__)
app.debug = True
np.set_printoptions(linewidth=300, suppress=True)

fashion_mnist_labels = {
    0: 'T-shirt/top',
    1: 'Trouser',
    2: 'Pullover',
    3: 'Dress',
    4: 'Coat',
    5: 'Sandal',
    6: 'Shirt',
    7: 'Sneaker',
    8: 'Bag',
    9: 'Ankle Boot',
}


@app.route("/", methods=['GET'])
def index():
    return render_template("index.html")


@app.route("/Projects", methods=['GET'])
def Projects():
    return render_template("Projects.html")


@app.route("/imageproc", methods=['POST'])
def process_image():
    b64 = request.form['image'].split(",")[1]
    d64 = base64.b64decode(b64)
    img = Image.open(BytesIO(d64))
    img = img.resize((28, 28), Image.ADAPTIVE)
    pxl = np.asarray(img)[:, :, 3]/255
    pxl = pxl.reshape(1, 1, 28, 28)
    contents = ''
    if os.path.isfile('AI-users.txt'):
        with open('AI-users.txt', 'r') as f:
            contents = f.read()
            contents = str(int(contents)+1)
    else:
        contents = str(0)
    with open('AI-users.txt', 'w') as f:
        f.write(contents)
    prediction = np.around(model.predict(pxl)*100, decimals=3)
    item = fashion_mnist_labels[np.argmax(prediction[0])]
    acc = prediction[0][np.argmax(prediction[0])]
    response = {
        'item': item,
        'acc': acc,
        'T-Shirt/Top': prediction[0][0],
        'Trouser': prediction[0][1],
        'Pullover': prediction[0][2],
        'Dress': prediction[0][3],
        'Coat': prediction[0][4],
        'Sandal': prediction[0][5],
        'Shirt': prediction[0][6],
        'Sneaker': prediction[0][7],
        'Bag': prediction[0][8],
        'Ankle Boot': prediction[0][9]
    }

    return json.dumps(response)


if __name__ == "__main__":
    app.run()
