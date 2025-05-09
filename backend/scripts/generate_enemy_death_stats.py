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
    plt.figure(figsize=(16, 9))
    ax = sns.countplot(data=df, x='enemy_name', order=df['enemy_name'].value_counts().index)
    plt.title('Muertes por enemigo')
    plt.ylabel('Número de muertes')
    plt.xlabel('Enemigo')
    plt.xticks(rotation=45, ha='right', fontsize=13)
    plt.subplots_adjust(bottom=0.28)
    plt.tight_layout()
    plt.savefig(img_path, bbox_inches='tight')
    plt.close()
    print(f"[enemy-death-stats] Imagen guardada en: {img_path}")
else:
    # Guardar imagen vacía para comprobar que la ruta funciona
    plt.figure(figsize=(10, 5))
    plt.text(0.5, 0.5, 'No hay datos', fontsize=22, ha='center', va='center')
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(img_path)
    plt.close()
    print(f"[enemy-death-stats] No hay datos. Imagen vacía guardada en: {img_path}")

# Gráfico 2: Muertes por día (línea)
if not df.empty:
    date_col = None
    for col in ['fecha', 'date', 'created_at', 'death_time']:
        if col in df.columns:
            date_col = col
            break
    if date_col:
        plt.figure(figsize=(10, 6))
        df[date_col] = pd.to_datetime(df[date_col])
        deaths_per_day = df.groupby(df[date_col].dt.date).size()
        import matplotlib.dates as mdates
        plt.figure(figsize=(16, 9))
        # Formatea las fechas como 'dd/mm' para el eje X
        formatted_dates = [d.strftime('%d/%m') for d in deaths_per_day.index]
        plt.plot(formatted_dates, deaths_per_day.values, marker='o', color='crimson', linewidth=2)
        plt.title('Muertes por día')
        plt.ylabel('Número de muertes')
        plt.xlabel('Día')
        plt.grid(True, linestyle='--', alpha=0.5)
        # Solo muestra cada N etiqueta, dependiendo de cuántas fechas haya
        N = max(1, len(formatted_dates)//8)
        for i, label in enumerate(plt.gca().get_xticklabels()):
            if i % N != 0:
                label.set_visible(False)
        plt.xticks(rotation=45, ha='right', fontsize=13)
        plt.subplots_adjust(bottom=0.28)
        plt.tight_layout()
        img_path_day = os.path.join(OUTPUT_DIR, 'deaths_per_day.png')
        plt.savefig(img_path_day, bbox_inches='tight')
        plt.close()
        print(f"[enemy-death-stats] Imagen guardada en: {img_path_day}")
    else:
        print("[enemy-death-stats] No se encontró columna de fecha para muertes por día.")

# Gráfico 3: Muertes por usuario/jugador (tarta/pie)
if not df.empty:
    user_col = None
    for col in ['user_id', 'player_name', 'jugador', 'usuario', 'player_nickname']:
        if col in df.columns:
            user_col = col
            break
    if user_col:
        plt.figure(figsize=(8, 8))
        death_counts = df[user_col].value_counts()
        plt.figure(figsize=(12, 12))
        plt.pie(death_counts.values, labels=death_counts.index, autopct='%1.1f%%', startangle=140, colors=sns.color_palette('pastel'), textprops={'fontsize': 15})
        plt.title('Proporción de muertes por usuario/jugador')
        plt.tight_layout()
        img_path_user = os.path.join(OUTPUT_DIR, 'deaths_per_user.png')
        plt.savefig(img_path_user, bbox_inches='tight')
        plt.close()
        print(f"[enemy-death-stats] Imagen guardada en: {img_path_user}")
    else:
        print("[enemy-death-stats] No se encontró columna de usuario/jugador para muertes por usuario.")

# Gráfico 4: Muertes por boss (barras horizontales)
if not df.empty:
    boss_col = None
    for col in ['boss_name', 'jefe']:
        if col in df.columns:
            boss_col = col
            break
    if boss_col:
        plt.figure(figsize=(10, 6))
        death_counts = df[boss_col].value_counts()
        plt.figure(figsize=(16, 9))
        plt.barh(death_counts.index, death_counts.values, color=sns.color_palette('muted'))
        plt.title('Muertes por boss')
        plt.xlabel('Número de muertes')
        plt.ylabel('Boss')
        plt.yticks(fontsize=13)
        plt.subplots_adjust(left=0.28)
        plt.tight_layout()
        img_path_boss = os.path.join(OUTPUT_DIR, 'deaths_per_boss.png')
        plt.savefig(img_path_boss, bbox_inches='tight')
        plt.close()
        print(f"[enemy-death-stats] Imagen guardada en: {img_path_boss}")
    else:
        print("[enemy-death-stats] No se encontró columna de boss para muertes por boss.")

