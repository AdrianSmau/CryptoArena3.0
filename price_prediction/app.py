import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from keras import models
from sklearn import preprocessing
import pandas as pd
import numpy as np
import json
from flask import Flask, request


DATA_FILE_NAME = 'data.json'
MODEL_FILE_NAME = 'model'

input_data_size = 4
epochs = 5
app = Flask(__name__)


@app.route('/feed', methods=['POST'])
def feed():
    # Obtain request data to feed algorithm
    entry = request.get_json()

    # Add entry to json data file
    with open(DATA_FILE_NAME, 'r') as data_file:
        current_data = json.load(data_file)
    current_data.append(entry)
    with open(DATA_FILE_NAME, 'w') as data_file:
        json.dump(current_data, data_file)

    # Format data
    train_data = []
    target_data = []
    for element in current_data:
        train_data.append(list(element['features'].values()))
        target_data.append(float(element['target']))

    # Normalize data
    train_df = pd.DataFrame(train_data, columns=[
                            'Level', 'Class', 'Wins', 'Losses'])
    df_values = train_df.values
    df_values_scaled = preprocessing.MinMaxScaler().fit_transform(df_values)
    train_df = pd.DataFrame(df_values_scaled)
    train_data = np.array(train_df.values.tolist())
    target_data = np.array(target_data)

    # Load model
    model = models.load_model(MODEL_FILE_NAME)

    # Retrain model
    history = model.fit(train_data, target_data,
                        epochs=epochs, verbose=0, shuffle=False)

    avg_loss = np.mean(history.history['loss'])

    # Save model
    model.save(MODEL_FILE_NAME)

    # Return loss
    return str(avg_loss)


@app.route('/predict', methods=['GET'])
def predict():
    # Obtain request data to be predicted
    entry = request.get_json()

    # Fetch current entries
    with open(DATA_FILE_NAME, 'r') as data_file:
        current_data = json.load(data_file)

    # Normalize data to be predicted in relation with already gathered data
    train_data = []
    for element in current_data:
        train_data.append(list(element['features'].values()))
    train_data.append(entry.values())
    test_df = pd.DataFrame(train_data, columns=[
                           'Level', 'Class', 'Wins', 'Losses'])
    df_values = test_df.values
    df_values_scaled = preprocessing.MinMaxScaler().fit_transform(df_values)
    test_df = pd.DataFrame(df_values_scaled)
    test_data = test_df.values.tolist()

    # Load model
    model = models.load_model(MODEL_FILE_NAME)

    # Select the data to be evaluated
    test = test_data[len(test_data) - 1]

    # Format test data to fit the model
    test = np.array(test)
    test = test[np.newaxis, ...]

    # Evaluate
    return str(abs(model.predict(test)[0][0]))
