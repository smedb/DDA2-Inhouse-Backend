import os
import sys
import pandas as pd
import joblib
import json
import pickle

# Obtén los datos pasados desde Node.js como argumento
data_json = sys.argv[1]

# # Convierte la cadena JSON de los datos en un objeto de Python
new_data = json.loads(data_json)

script_dir = os.path.dirname(os.path.realpath(__file__))

# Construye el path completo al modelo entrenado

model_path = os.path.join(script_dir, 'modelo_decision_tree.pkl')

# Carga el modelo entrenado
model = pickle.load(open(model_path, "rb"))

# Crear un DataFrame con los datos de nueva entrada
new_data_df = pd.DataFrame([new_data])

# Reordenar las columnas para que coincidan con el orden del modelo entrenado
# new_data_encoded = new_data_encoded.reindex(columns=model.feature_names_in_)

# Realiza la predicción usando tu modelo
resultado = model.predict(new_data_df)


# Devuelve el resultado al entorno de Node.js
print(resultado[0])
