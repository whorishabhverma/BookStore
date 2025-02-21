from pymongo import MongoClient
import pandas as pd
from surprise import Dataset, Reader, SVD
import pickle

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Update if needed
db = client["courseSellingApp2"]
reviews_collection = db["reviews"]  # Ensure the correct collection name

# Fetch user ratings dynamically
reviews = list(reviews_collection.find({}, {"user": 1, "book": 1, "rating": 1, "_id": 0}))

# Convert ObjectId to string
for review in reviews:
    review["user"] = str(review["user"])
    review["book"] = str(review["book"])

# Convert to DataFrame
df = pd.DataFrame(reviews)

# Check if there is enough data to train the model
if df.empty:
    print("⚠️ No ratings found in database. Train the model after collecting more data.")
else:
    # Prepare dataset for Surprise library
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df[['user', 'book', 'rating']], reader)

    # Train model
    trainset = data.build_full_trainset()
    model = SVD()
    model.fit(trainset)

    # Save trained model
    with open("book_recommendation_model.pkl", "wb") as file:
        pickle.dump(model, file)

    print("✅ Model trained and saved successfully!")
