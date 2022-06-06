import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from random import randrange, uniform
from keras import models, layers
import json

DATA_FILE_NAME = 'data.json'
MODEL_FILE_NAME = 'model'
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

model.save(MODEL_FILE_NAME)
