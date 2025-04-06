import pandas as pd

# Read CSV file
customer_df = pd.read_csv('customer_data_collection.csv')
products_df = pd.read_csv('product_recommendation_data.csv')


# Print the DataFrame
print("Customer Dataset\n",customer_df)
print("Product Dataset\n",products_df)
