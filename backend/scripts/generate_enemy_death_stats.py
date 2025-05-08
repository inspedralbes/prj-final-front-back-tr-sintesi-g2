import os
import pymysql
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from datetime import datetime

# Load DB credentials from environment variables
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = int(os.getenv('DB_PORT', 3306))

# Output directory for generated images
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '../stat_images')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Connect to the database
conn = pymysql.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASS,
    database=DB_NAME,
    port=DB_PORT
)

# Query enemy death stats
df = pd.read_sql('SELECT * FROM enemy_death_stat', conn)

# Example plot: deaths per enemy
if not df.empty:
    plt.figure(figsize=(10, 6))
    ax = sns.countplot(data=df, x='enemy_name', order=df['enemy_name'].value_counts().index)
    plt.title('Muertes por enemigo')
    plt.ylabel('Número de muertes')
    plt.xlabel('Enemigo')
    plt.xticks(rotation=45)
    plt.tight_layout()
    img_path = os.path.join(OUTPUT_DIR, 'deaths_per_enemy.png')
    plt.savefig(img_path)
    plt.close()

    # You can add more plots here, e.g., deaths per boss, per player, etc.

conn.close()
