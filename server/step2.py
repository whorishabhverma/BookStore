import pickle

with open("book_recommendation_model.pkl", "rb") as file:
    model = pickle.load(file)



user_id = "some_user_id"
book_id = "some_book_id"
predicted_rating = model.predict(user_id, book_id).est
print(f"Predicted Rating: {predicted_rating}")
