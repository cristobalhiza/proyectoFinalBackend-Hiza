
import Product from './models/productsModel.js';

export class ProductsManager {
    async addProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            return await this.getAllProducts();
        } catch (error) {
            throw new Error('Error adding product: ' + error.message);
        }
    }

    async getAllProducts({ query = {}, limit = 10, page = 1, sort = null } = {}) {
        try {
            const filter = {};

            // Apply query filters for category and availability (stock > 0)
            if (query.category) {
                filter.category = query.category;
            }
            if (query.availability) {
                filter.stock = { $gt: 0 };
            }

            const productsQuery = Product.find(filter).lean();

            // Apply sorting if provided (asc or desc by price)
            if (sort) {
                productsQuery.sort({ price: sort === 'asc' ? 1 : -1 });
            }

            // Apply pagination
            const totalProducts = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);
            const products = await productsQuery.skip((page - 1) * limit).limit(limit);

            return {
                products,
                totalProducts,
                totalPages,
                page,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
            };
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    }

    async getProductById(productId) {
        try {
            return await Product.findById(productId).lean();
        } catch (error) {
            throw new Error('Error fetching product by ID: ' + error.message);
        }
    }

    async deleteProduct(productId) {
        try {
            await Product.findByIdAndDelete(productId);
            return await this.getAllProducts();
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }

    async updateProduct(productId, productData) {
        try {
            return await Product.findByIdAndUpdate(productId, productData, { new: true }).lean();
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }
}

export const productsManager = new ProductsManager();
