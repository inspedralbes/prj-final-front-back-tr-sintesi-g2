import os
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from datetime import datetime
from sqlalchemy import create_engine

DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = int(os.getenv('DB_PORT', 3306))

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '../stat_images')
os.makedirs(OUTPUT_DIR, exist_ok=True)

engine = create_engine(f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

df = pd.read_sql('SELECT * FROM enemy_death_stat', engine)
print(f"[enemy-death-stats] Filas encontradas en enemy_death_stat: {len(df)}")

### 1. Muertes por enemigo
img_path = os.path.join(OUTPUT_DIR, 'deaths_per_enemy.png')
if not df.empty and 'enemy_name' in df.columns:
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
    print("[enemy-death-stats] No se encontró la columna 'enemy_name' o el DataFrame está vacío.")

### 2. Muertes por día
img_path_day = os.path.join(OUTPUT_DIR, 'deaths_per_day.png')
if not df.empty and 'death_time' in df.columns:
    df['death_time'] = pd.to_datetime(df['death_time'])
    deaths_per_day = df.groupby(df['death_time'].dt.date).size()
    if not deaths_per_day.empty:
        formatted_dates = [d.strftime('%d/%m') for d in deaths_per_day.index]
        plt.figure(figsize=(16, 9))
        plt.plot(formatted_dates, deaths_per_day.values, marker='o', color='crimson', linewidth=2)
        plt.title('Muertes por día')
        plt.ylabel('Número de muertes')
        plt.xlabel('Día')
        plt.grid(True, linestyle='--', alpha=0.5)
        N = max(1, len(formatted_dates)//8)
        for i, label in enumerate(plt.gca().get_xticklabels()):
            if i % N != 0:
                label.set_visible(False)
        plt.xticks(rotation=45, ha='right', fontsize=13)
        plt.subplots_adjust(bottom=0.28)
        plt.tight_layout()
        plt.savefig(img_path_day, bbox_inches='tight')
        plt.close()
        print(f"[enemy-death-stats] Imagen guardada en: {img_path_day}")
    else:
        print("[enemy-death-stats] No hay datos para la gráfica de muertes por día.")
else:
    print("[enemy-death-stats] No se encontró columna 'death_time'.")

### 3. Muertes por usuario
img_path_user = os.path.join(OUTPUT_DIR, 'deaths_per_user.png')
if 'nickname' in df.columns:
    death_counts = df['nickname'].dropna().value_counts()
    if not death_counts.empty:
        plt.figure(figsize=(12, 12))
        plt.pie(death_counts.values, labels=death_counts.index, autopct='%1.1f%%', startangle=140, colors=sns.color_palette('pastel'), textprops={'fontsize': 15})
        plt.title('Proporción de muertes por usuario/jugador')
        plt.tight_layout()
        plt.savefig(img_path_user, bbox_inches='tight')
        plt.close()
        print(f"[enemy-death-stats] Imagen guardada en: {img_path_user}")
    else:
        plt.figure(figsize=(10, 5))
        plt.text(0.5, 0.5, 'No hay datos de usuarios', fontsize=22, ha='center', va='center')
        plt.axis('off')
        plt.tight_layout()
        plt.savefig(img_path_user)
        plt.close()
        print(f"[enemy-death-stats] No hay datos. Imagen de usuarios vacía generada.")
else:
    print("[enemy-death-stats] No se encontró columna 'nickname'.")

### 4. Muertes por boss
img_path_boss = os.path.join(OUTPUT_DIR, 'deaths_per_boss.png')
if 'bossName' in df.columns:
    death_counts = df['bossName'].dropna().value_counts()
    if not death_counts.empty:
        plt.figure(figsize=(16, 9))
        plt.barh(death_counts.index, death_counts.values, color=sns.color_palette('muted'))
        plt.title('Muertes por boss')
        plt.xlabel('Número de muertes')
        plt.ylabel('Boss')
        plt.yticks(fontsize=13)
        plt.subplots_adjust(left=0.28)
        plt.tight_layout()
        plt.savefig(img_path_boss, bbox_inches='tight')
        plt.close()
        print(f"[enemy-death-stats] Imagen guardada en: {img_path_boss}")
    else:
        plt.figure(figsize=(10, 5))
        plt.text(0.5, 0.5, 'No hay datos de bosses', fontsize=22, ha='center', va='center')
        plt.axis('off')
        plt.tight_layout()
        plt.savefig(img_path_boss)
        plt.close()
        print(f"[enemy-death-stats] No hay datos. Imagen de boss vacía generada.")
else:
    print("[enemy-death-stats] No se encontró columna 'bossName'.")
