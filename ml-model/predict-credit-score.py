import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import joblib
import json

# Cargar datos desde el archivo CSV
df = pd.read_csv('training_data.csv')

# Definir las características y el objetivo
X = df.drop(["ID", "credit_score"], axis=1)
y = df["credit_score"]

# Preprocesamiento de datos
categorical_features = ["immovables", "monthly_income", "employment_situation", "has_tesla"]
categorical_transformer = OneHotEncoder(sparse_output=False)

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", categorical_transformer, categorical_features),
    ]
)

# Crear el modelo de árbol de decisión
model = DecisionTreeClassifier(random_state=42, criterion= 'entropy')

# Crear el pipeline con preprocesamiento y modelo
pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model),
    ]
)

# Dividir los datos en conjuntos de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entrenar el modelo
pipeline.fit(X_train, y_train)

# Evaluar el modelo
score = pipeline.score(X_test, y_test)
print(f"Model R² score: {score}")

joblib.dump(pipeline, './modelo_decision_tree.pkl', compress = 1)

# Ejemplo de predicción
new_data = {
    "immovables": "1-2", # 2, >2
    "monthly_income": "<500", # <1000 - >1000
    "employment_situation": "employee", # self-employed - unemployed 
    "has_tesla": "no" # SI
}

prediction = pipeline.predict(pd.DataFrame([new_data]))
print(f"Credit score prediction: {prediction[0]}")