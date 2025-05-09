import os
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from datetime import datetime
from sqlalchemy import create_engine

# Load DB credentials from environment variables
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = int(os.getenv('DB_PORT', 3306))

# Output directory for generated images
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '../stat_images')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Create SQLAlchemy engine for MySQL
engine = create_engine(f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

# Query enemy death stats
df = pd.read_sql('SELECT * FROM enemy_death_stat', engine)

print(f"[enemy-death-stats] Filas encontradas en enemy_death_stat: {len(df)}")

img_path = os.path.join(OUTPUT_DIR, 'deaths_per_enemy.png')

# Example plot: deaths per enemy
if not df.empty:
    plt.figure(figsize=(10, 6))
    ax = sns.countplot(data=df, x='enemy_name', order=df['enemy_name'].value_counts().index)
    plt.title('Muertes por enemigo')
    plt.ylabel('Número de muertes')
    plt.xlabel('Enemigo')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(img_path)
    plt.close()
    print(f"[enemy-death-stats] Imagen guardada en: {img_path}")
else:
    # Guardar imagen vacía para comprobar que la ruta funciona
    plt.figure(figsize=(8, 4))
    plt.text(0.5, 0.5, 'No hay datos', fontsize=20, ha='center', va='center')
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(img_path)
    plt.close()
    print(f"[enemy-death-stats] No hay datos. Imagen vacía guardada en: {img_path}")

# Puedes añadir más gráficos aquí, por ejemplo: muertes por boss, por jugador, etc.

