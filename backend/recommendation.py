def recommend_products(customer_id):
    import pandas as pd

    # Load your customer and product data
    customer_data = pd.read_csv("customer_data_collection.csv")
    product_data = pd.read_csv("product_recommendation_data.csv")

    # Check if customer ID exists
    customer_exists = customer_id in customer_data["CustomerID"].values

    if customer_exists:
        # Your existing personalized recommendation logic here
        recommended_products = personalized_recommendation(customer_id)
        message = "✅ Showing personalized recommendations."
    else:
        # Fallback: return generic top-rated or popular products
        recommended_products = product_data.sort_values(by="Rating", ascending=False).head(10)
        # Assign dummy similarity values for consistency
        recommended_products["Similarity"] = 0.0
        message = "⚠️ Customer not found, showing top-rated products."

    # Format the response
    recommendations = []
    for _, row in recommended_products.iterrows():
        recommendations.append({
            "brand": row["Brand"],
            "category": row["Category"],
            "subcategory": row["Subcategory"],
            "rating": row.get("Rating", None),
            "similarity": round(row["Similarity"], 3),
            "reason": "Popular item" if not customer_exists else "High similarity"
        })

    return {
        "customer_id": customer_id,
        "message": message,
        "recommendations": recommendations
    }
