import React, { useState, useEffect } from 'react';

function CategoryProducts() {
    const [category, setCategory] = useState('electronics');
    const [products, setProducts] = useState([]);

    // Fetch products based on the selected category
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(
                `https://fakestoreapi.com/products/category/${category}`
            );
            const data = await response.json();
            setProducts(data);
        };

        fetchProducts();
    }, [category]); // Runs when 'category' changes

    return (
        <div>
            <h1>Category: {category}</h1>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="electronics">Electronics</option>
                <option value="jewelery">Jewelery</option>
                <option value="men's clothing">Men's Clothing</option>
                <option value="women's clothing">Women's Clothing</option>
            </select>
            <div>
                {products.map((product) => (
                    <div key={product.id}>
                        <h3>{product.title}</h3>
                        <p>${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryProducts;
