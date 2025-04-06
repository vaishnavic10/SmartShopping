import sqlite3
import pandas as pd

# Connect to ecommerce.db
conn = sqlite3.connect("ecommerce.db")

# Show all tables
tables = pd.read_sql_query("SELECT name FROM sqlite_master WHERE type='table';", conn)
print("📋 Tables in ecommerce.db:\n", tables)

# Show first few rows from customers table
customers = pd.read_sql_query("SELECT * FROM customers LIMIT 5;", conn)
print("\n👥 Sample Customers:\n", customers)

conn = sqlite3.connect("smart_shopping_ai.db")

# Show all tables
tables = pd.read_sql_query("SELECT name FROM sqlite_master WHERE type='table';", conn)
print("\n📋 Tables in smart_shopping_ai.db:\n", tables)

# Show first few rows from products table
products = pd.read_sql_query("SELECT * FROM products LIMIT 5;", conn)
print("\n🛍️ Sample Products:\n", products)

conn.close()
