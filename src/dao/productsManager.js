import Product from './models/productsModel.js';

export default class ProductsManager {

    static async get(page = 1, limit = 20) {
        return await Product.paginate({}, { lean: true, page, limit });
    }

    static async getBy(filtro = {}) {
        return await Product.findOne(filtro).lean();
    }

    static async create(product) {
        return await Product.create(product);
    }

    static async update(id, product) {
        return await Product.findByIdAndUpdate(id, product, { new: true }).lean();
    }

    static async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}