import sqlite3
import pandas as pd

# Load datasets
customer_df = pd.read_csv('customer_data_collection.csv')
product_df = pd.read_csv('product_recommendation_data.csv')

# Connect to ecommerce.db and populate customers table
conn1 = sqlite3.connect('ecommerce.db')
customer_df.to_sql('customers', conn1, if_exists='replace', index=False)
conn1.close()

# Connect to smart_shopping_ai.db and populate products table
conn2 = sqlite3.connect('smart_shopping_ai.db')
product_df.to_sql('products', conn2, if_exists='replace', index=False)
conn2.close()

print("✅ Databases populated successfully!")
