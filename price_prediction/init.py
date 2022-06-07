import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import json
from sklearn import preprocessing
import numpy as np
import pandas as pd
from keras import models, layers
from random import randrange, uniform

DATA_FILE_NAME = 'data.json'
MODEL_FILE_NAME = 'model'
LOSS_FILE_NAME = 'loss.json'
input_data_size = 4
epochs = 5

data = []

# Create initial dataset
for i in range(0, 400):
    fighter_class = randrange(3)
    wins = randrange(42)
    losses = randrange(42)
    level = (wins * 40 + losses * 25) // 100 + 1
    base_price = level * 0.005
    price = format(uniform(base_price - 0.0045, base_price + 0.05), ".4f")
    data.append({"features": {
        "level": level, "class": fighter_class, "wins": wins, "losses": losses}, "target": price})
with open(DATA_FILE_NAME, 'w') as data_file:
    json.dump(data, data_file)

# Create and compile model
model = models.Sequential()
model.add(layers.Dense(16, activation="relu",
                       input_shape=(input_data_size,)))
model.add(layers.Dense(4, activation="relu"))
model.add(layers.Dense(1))
model.compile(optimizer="adam", loss="mse")

# Format data
train_data = []
target_data = []
for element in data:
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

history = model.fit(train_data, target_data,
                    epochs=epochs, verbose=0, shuffle=False)

avg_loss = np.mean(history.history['loss'])

# Save model
model.save(MODEL_FILE_NAME)

# Save loss
with open(LOSS_FILE_NAME, 'w') as loss_file:
    json.dump({"loss": str(format(avg_loss, ".4f"))}, loss_file)
