
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd
import ast
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Load model globally
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_purchase_history(customer_id):
    conn = sqlite3.connect("ecommerce.db")
    cursor = conn.cursor()
    cursor.execute("SELECT Purchase_History FROM customers WHERE Customer_ID = ?", (customer_id,))
    result = cursor.fetchone()
    conn.close()
    if result:
        try:
            return ast.literal_eval(result[0])
        except Exception:
            return []
    return []

def get_product_data():
    conn = sqlite3.connect("smart_shopping_ai.db")
    df = pd.read_sql_query("SELECT * FROM products", conn)
    conn.close()
    return df.loc[:, ~df.columns.str.contains('^Unnamed')]

def generate_recommendations(customer_id):
    if not customer_id or not customer_id.strip():
        return jsonify({"error": "⚠️ Please enter a valid Customer ID."}), 400

    df = get_product_data()
    purchased_products = get_purchase_history(customer_id)

    if not purchased_products:
        top_rated = df.sort_values(by="Product_Rating", ascending=False).head(5)
        recommendations = [
            {
                "brand": row["Brand"],
                "category": row["Category"],
                "subcategory": row["Subcategory"],
                "rating": row.get("Product_Rating"),
                "reason": "Top-rated product"
            }
            for _, row in top_rated.iterrows()
        ]
        return jsonify({
            "message": "⚠️ Customer not found. Showing top-rated products instead.",
            "recommendations": recommendations
        })

    df["Product_Description"] = (
        df["Brand"].astype(str) + " " +
        df["Category"].astype(str) + " " +
        df["Subcategory"].astype(str) + " with sentiment score " +
        df["Customer_Review_Sentiment_Score"].astype(str)
    )

    purchased_descriptions = df[df["Subcategory"].isin(purchased_products)]["Product_Description"].tolist()

    if not purchased_descriptions:
        return jsonify({
            "message": "⚠️ No matching product descriptions found for this customer.",
            "recommendations": []
        })

    purchased_embeddings = model.encode(purchased_descriptions)
    all_embeddings = model.encode(df["Product_Description"].tolist())
    similarity_scores = cosine_similarity(purchased_embeddings, all_embeddings).mean(axis=0)

    df["Similarity"] = similarity_scores
    recommended = df[~df["Subcategory"].isin(purchased_products)]
    recommended = recommended.sort_values(by="Similarity", ascending=False)
    recommended = recommended.drop_duplicates(subset=["Brand", "Category", "Subcategory"]).head(5)

    recommendations = [
        {
            "brand": row["Brand"],
            "category": row["Category"],
            "subcategory": row["Subcategory"],
            "similarity": round(float(row["Similarity"]), 3),
            "reason": "Recommended based on purchase history"
        }
        for _, row in recommended.iterrows()
    ]

    return jsonify({
        "message": "✅ Personalized recommendations generated successfully.",
        "recommendations": recommendations
    })

# ✅ POST route for frontend
@app.route('/recommend', methods=['POST'])
def recommend_post():
    data = request.get_json()
    customer_id = data.get('customer_id')
    return generate_recommendations(customer_id)

# ✅ GET route for browser/postman testing
@app.route('/recommend/<customer_id>', methods=['GET'])
def recommend_get(customer_id):
    return generate_recommendations(customer_id)

# ✅ Improved Purchase History Route with Full Product Details
@app.route('/purchase-history', methods=['POST'])
def purchase_history():
    data = request.get_json()
    customer_id = data.get('customer_id')

    if not customer_id or not customer_id.strip():
        return jsonify({"error": "Invalid Customer ID"}), 400

    history_subcategories = get_purchase_history(customer_id)
    if not history_subcategories:
        return jsonify({
            "message": f"⚠️ Customer ID: {customer_id} not Found!!",
            "customer_id": customer_id,
            "history": []
        })

    df = get_product_data()

    # Fetch only one product per subcategory as a sample
    history_df = df[df["Subcategory"].isin(history_subcategories)]
    history_sampled = history_df.groupby("Subcategory").first().reset_index()

    purchase_history_details = history_sampled.to_dict(orient="records")

    return jsonify({
        "message": f"✅ Purchase history for Customer ID: {customer_id}",
        "customer_id": customer_id,
        "history": purchase_history_details
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
