
import mongoose from 'mongoose';
import Product from './dao/models/productsModel.js';
import { config } from './config/config.js';

const MONGO_URI = config.MONGO_URL;

const products = [
    { 'code': 'P001', 'title': 'Doohickey 22', 'description': 'A popular book', 'price': 88.28, 'category': 'Books', 'stock': 45, 'status': true, 'thumbnail': 'img1.jpg' },
    { 'code': 'P002', 'title': 'Contraption 45', 'description': 'An innovative book', 'price': 353.07, 'category': 'Books', 'stock': 5, 'status': true, 'thumbnail': 'img2.jpg' },
    { 'code': 'P003', 'title': 'Thingamajig 41', 'description': 'Fun toy', 'price': 619.84, 'category': 'Toys', 'stock': 27, 'status': true, 'thumbnail': 'img3.jpg' },
    { 'code': 'P004', 'title': 'Contraption 34', 'description': 'Electronic device', 'price': 507.04, 'category': 'Electronics', 'stock': 8, 'status': true, 'thumbnail': 'img4.jpg' },
    { 'code': 'P005', 'title': 'Thingamajig 48', 'description': 'High-quality electronic gadget', 'price': 492.28, 'category': 'Electronics', 'stock': 10, 'status': true, 'thumbnail': 'img5.jpg' },
    { 'code': 'P006', 'title': 'Contraption 69', 'description': 'Sports gear', 'price': 758.48, 'category': 'Sports', 'stock': 2, 'status': true, 'thumbnail': 'img6.jpg' },
    { 'code': 'P007', 'title': 'Device 89', 'description': 'Advanced electronic device', 'price': 878.58, 'category': 'Electronics', 'stock': 34, 'status': true, 'thumbnail': 'img7.jpg' },
    { 'code': 'P008', 'title': 'Doohickey 38', 'description': 'A versatile toy', 'price': 676.34, 'category': 'Toys', 'stock': 15, 'status': true, 'thumbnail': 'img8.jpg' },
    { 'code': 'P009', 'title': 'Device 38', 'description': 'Reliable electronic device', 'price': 364.27, 'category': 'Electronics', 'stock': 49, 'status': true, 'thumbnail': 'img9.jpg' },
    { 'code': 'P010', 'title': 'Thingamajig 53', 'description': 'Sports equipment', 'price': 174.37, 'category': 'Sports', 'stock': 26, 'status': true, 'thumbnail': 'img10.jpg' },
    { 'code': 'P011', 'title': 'Doohickey 60', 'description': 'Premium toy', 'price': 915.41, 'category': 'Toys', 'stock': 20, 'status': true, 'thumbnail': 'img11.jpg' },
    { 'code': 'P012', 'title': 'Thingamajig 36', 'description': 'Beauty product', 'price': 732.27, 'category': 'Beauty', 'stock': 21, 'status': true, 'thumbnail': 'img12.jpg' },
    { 'code': 'P013', 'title': 'Doodad 49', 'description': 'Electronic gadget', 'price': 252.07, 'category': 'Electronics', 'stock': 11, 'status': true, 'thumbnail': 'img13.jpg' },
    { 'code': 'P014', 'title': 'Widget 64', 'description': 'Classic book', 'price': 22.51, 'category': 'Books', 'stock': 36, 'status': true, 'thumbnail': 'img14.jpg' },
    { 'code': 'P015', 'title': 'Doohickey 48', 'description': 'Fun toy', 'price': 222.6, 'category': 'Toys', 'stock': 34, 'status': true, 'thumbnail': 'img15.jpg' },
    { 'code': 'P016', 'title': 'Gadget 84', 'description': 'High-end electronic device', 'price': 946.18, 'category': 'Electronics', 'stock': 15, 'status': true, 'thumbnail': 'img16.jpg' },
    { 'code': 'P017', 'title': 'Contraption 3', 'description': 'Sports accessory', 'price': 211.18, 'category': 'Sports', 'stock': 42, 'status': true, 'thumbnail': 'img17.jpg' },
    { 'code': 'P018', 'title': 'Gadget 88', 'description': 'Versatile electronic device', 'price': 564.6, 'category': 'Electronics', 'stock': 39, 'status': true, 'thumbnail': 'img18.jpg' },
    { 'code': 'P019', 'title': 'Widget 41', 'description': 'Beauty product', 'price': 347.44, 'category': 'Beauty', 'stock': 14, 'status': true, 'thumbnail': 'img19.jpg' },
    { 'code': 'P020', 'title': 'Widget 76', 'description': 'Sports equipment', 'price': 374.16, 'category': 'Sports', 'stock': 18, 'status': true, 'thumbnail': 'img20.jpg' },
    { 'code': 'P021', 'title': 'Doohickey 76', 'description': 'Popular book', 'price': 909.52, 'category': 'Books', 'stock': 19, 'status': true, 'thumbnail': 'img21.jpg' },
    { 'code': 'P022', 'title': 'Thingamajig 48', 'description': 'Beauty gadget', 'price': 362.57, 'category': 'Beauty', 'stock': 4, 'status': true, 'thumbnail': 'img22.jpg' },
    { 'code': 'P023', 'title': 'Gadget 11', 'description': 'Beauty device', 'price': 529.2, 'category': 'Beauty', 'stock': 7, 'status': true, 'thumbnail': 'img23.jpg' },
    { 'code': 'P024', 'title': 'Widget 46', 'description': 'Toys for kids', 'price': 162.05, 'category': 'Toys', 'stock': 1, 'status': true, 'thumbnail': 'img24.jpg' },
    { 'code': 'P025', 'title': 'Contraption 99', 'description': 'Special book', 'price': 516.95, 'category': 'Books', 'stock': 15, 'status': true, 'thumbnail': 'img25.jpg' },
    { 'code': 'P026', 'title': 'Doodad 93', 'description': 'Sports gear', 'price': 236.5, 'category': 'Sports', 'stock': 28, 'status': true, 'thumbnail': 'img26.jpg' },
    { 'code': 'P027', 'title': 'Gadget 61', 'description': 'Sports accessory', 'price': 735.91, 'category': 'Sports', 'stock': 42, 'status': true, 'thumbnail': 'img27.jpg' },
    { 'code': 'P028', 'title': 'Thingamajig 53', 'description': 'Furniture gadget', 'price': 258.61, 'category': 'Furniture', 'stock': 39, 'status': true, 'thumbnail': 'img28.jpg' },
    { 'code': 'P029', 'title': 'Device 2', 'description': 'Sports gadget', 'price': 154.61, 'category': 'Sports', 'stock': 1, 'status': true, 'thumbnail': 'img29.jpg' },
    { 'code': 'P030', 'title': 'Doohickey 90', 'description': 'Beauty gadget', 'price': 525.46, 'category': 'Beauty', 'stock': 37, 'status': true, 'thumbnail': 'img30.jpg' },
    { 'code': 'P031', 'title': 'Doodad 78', 'description': 'Electronic device', 'price': 963.23, 'category': 'Electronics', 'stock': 43, 'status': true, 'thumbnail': 'img31.jpg' },
    { 'code': 'P032', 'title': 'Doodad 67', 'description': 'Beauty accessory', 'price': 640.46, 'category': 'Beauty', 'stock': 20, 'status': true, 'thumbnail': 'img32.jpg' },
    { 'code': 'P033', 'title': 'Gadget 19', 'description': 'A highly sought-after book', 'price': 869.87, 'category': 'Books', 'stock': 43, 'status': true, 'thumbnail': 'img33.jpg' },
    { 'code': 'P034', 'title': 'Doodad 25', 'description': 'Popular sports equipment', 'price': 735.26, 'category': 'Sports', 'stock': 27, 'status': true, 'thumbnail': 'img34.jpg' },
    { 'code': 'P035', 'title': 'Widget 93', 'description': 'Book bestseller', 'price': 802.75, 'category': 'Books', 'stock': 45, 'status': true, 'thumbnail': 'img35.jpg' },
    { 'code': 'P036', 'title': 'Contraption 68', 'description': 'Beauty product', 'price': 647.0, 'category': 'Beauty', 'stock': 16, 'status': true, 'thumbnail': 'img36.jpg' },
    { 'code': 'P037', 'title': 'Doohickey 20', 'description': 'Sports gadget', 'price': 486.69, 'category': 'Sports', 'stock': 7, 'status': true, 'thumbnail': 'img37.jpg' },
    { 'code': 'P038', 'title': 'Gadget 40', 'description': 'Clothing accessory', 'price': 328.73, 'category': 'Clothing', 'stock': 43, 'status': true, 'thumbnail': 'img38.jpg' },
    { 'code': 'P039', 'title': 'Thingamajig 27', 'description': 'Clothing gadget', 'price': 191.88, 'category': 'Clothing', 'stock': 40, 'status': true, 'thumbnail': 'img39.jpg' },
    { 'code': 'P040', 'title': 'Widget 46', 'description': 'Sports accessory', 'price': 745.73, 'category': 'Sports', 'stock': 38, 'status': true, 'thumbnail': 'img40.jpg' },
    { 'code': 'P041', 'title': 'Doodad 85', 'description': 'Popular book', 'price': 522.72, 'category': 'Books', 'stock': 50, 'status': true, 'thumbnail': 'img41.jpg' },
    { 'code': 'P042', 'title': 'Widget 21', 'description': 'Clothing item', 'price': 28.4, 'category': 'Clothing', 'stock': 41, 'status': true, 'thumbnail': 'img42.jpg' },
    { 'code': 'P043', 'title': 'Device 20', 'description': 'Advanced book', 'price': 971.3, 'category': 'Books', 'stock': 17, 'status': true, 'thumbnail': 'img43.jpg' },
    { 'code': 'P044', 'title': 'Doodad 8', 'description': 'High-quality furniture', 'price': 822.47, 'category': 'Furniture', 'stock': 24, 'status': true, 'thumbnail': 'img44.jpg' },
    { 'code': 'P045', 'title': 'Doodad 84', 'description': 'Beauty product', 'price': 675.96, 'category': 'Beauty', 'stock': 4, 'status': true, 'thumbnail': 'img45.jpg' },
    { 'code': 'P046', 'title': 'Doodad 67', 'description': 'A fun toy', 'price': 829.26, 'category': 'Toys', 'stock': 29, 'status': true, 'thumbnail': 'img46.jpg' },
    { 'code': 'P047', 'title': 'Thingamajig 23', 'description': 'Electronic gadget', 'price': 455.53, 'category': 'Electronics', 'stock': 14, 'status': true, 'thumbnail': 'img47.jpg' },
    { 'code': 'P048', 'title': 'Doodad 96', 'description': 'Clothing accessory', 'price': 66.0, 'category': 'Clothing', 'stock': 5, 'status': true, 'thumbnail': 'img48.jpg' },
    { 'code': 'P049', 'title': 'Thingamajig 63', 'description': 'Toy for kids', 'price': 559.06, 'category': 'Toys', 'stock': 16, 'status': true, 'thumbnail': 'img49.jpg' },
    { 'code': 'P050', 'title': 'Doodad 90', 'description': 'High-end toy', 'price': 927.61, 'category': 'Toys', 'stock': 37, 'status': true, 'thumbnail': 'img50.jpg' },
    { 'code': 'P051', 'title': 'Contraption 67', 'description': 'Clothing product', 'price': 955.94, 'category': 'Clothing', 'stock': 18, 'status': true, 'thumbnail': 'img51.jpg' },
    { 'code': 'P052', 'title': 'Doodad 19', 'description': 'Beauty item', 'price': 502.5, 'category': 'Beauty', 'stock': 24, 'status': true, 'thumbnail': 'img52.jpg' },
    { 'code': 'P053', 'title': 'Thingamajig 77', 'description': 'Toy product', 'price': 795.31, 'category': 'Toys', 'stock': 21, 'status': true, 'thumbnail': 'img53.jpg' },
    { 'code': 'P054', 'title': 'Doodad 33', 'description': 'Furniture product', 'price': 270.15, 'category': 'Furniture', 'stock': 14, 'status': true, 'thumbnail': 'img54.jpg' },
    { 'code': 'P055', 'title': 'Contraption 81', 'description': 'High-end toy', 'price': 875.55, 'category': 'Toys', 'stock': 43, 'status': true, 'thumbnail': 'img55.jpg' },
    { 'code': 'P056', 'title': 'Device 67', 'description': 'Furniture gadget', 'price': 542.66, 'category': 'Furniture', 'stock': 30, 'status': true, 'thumbnail': 'img56.jpg' },
    { 'code': 'P057', 'title': 'Thingamajig 12', 'description': 'Furniture item', 'price': 780.98, 'category': 'Furniture', 'stock': 49, 'status': true, 'thumbnail': 'img57.jpg' },
    { 'code': 'P058', 'title': 'Widget 10', 'description': 'Popular sports product', 'price': 923.25, 'category': 'Sports', 'stock': 38, 'status': true, 'thumbnail': 'img58.jpg' },
    { 'code': 'P059', 'title': 'Device 33', 'description': 'Clothing device', 'price': 595.03, 'category': 'Clothing', 'stock': 15, 'status': true, 'thumbnail': 'img59.jpg' },
    { 'code': 'P060', 'title': 'Gadget 3', 'description': 'Beauty gadget', 'price': 858.79, 'category': 'Beauty', 'stock': 11, 'status': true, 'thumbnail': 'img60.jpg' },
    { 'code': 'P061', 'title': 'Device 4', 'description': 'Sports gadget', 'price': 166.96, 'category': 'Sports', 'stock': 2, 'status': true, 'thumbnail': 'img61.jpg' },
    { 'code': 'P062', 'title': 'Thingamajig 79', 'description': 'Clothing gadget', 'price': 953.17, 'category': 'Clothing', 'stock': 2, 'status': true, 'thumbnail': 'img62.jpg' },
    { 'code': 'P063', 'title': 'Thingamajig 8', 'description': 'Toys for kids', 'price': 482.42, 'category': 'Toys', 'stock': 43, 'status': true, 'thumbnail': 'img63.jpg' },
    { 'code': 'P064', 'title': 'Widget 16', 'description': 'Beauty item', 'price': 378.44, 'category': 'Beauty', 'stock': 38, 'status': true, 'thumbnail': 'img64.jpg' },
    { 'code': 'P065', 'title': 'Device 75', 'description': 'Clothing item', 'price': 51.09, 'category': 'Clothing', 'stock': 34, 'status': true, 'thumbnail': 'img65.jpg' },
    { 'code': 'P066', 'title': 'Doohickey 79', 'description': 'Toy gadget', 'price': 537.06, 'category': 'Toys', 'stock': 39, 'status': true, 'thumbnail': 'img66.jpg' },
    { 'code': 'P067', 'title': 'Doohickey 8', 'description': 'Electronic gadget', 'price': 681.08, 'category': 'Electronics', 'stock': 38, 'status': true, 'thumbnail': 'img67.jpg' },
    { 'code': 'P068', 'title': 'Device 58', 'description': 'High-end electronic device', 'price': 634.56, 'category': 'Electronics', 'stock': 46, 'status': true, 'thumbnail': 'img68.jpg' },
    { 'code': 'P069', 'title': 'Gadget 55', 'description': 'Beauty accessory', 'price': 346.43, 'category': 'Beauty', 'stock': 50, 'status': true, 'thumbnail': 'img69.jpg' },
    { 'code': 'P070', 'title': 'Contraption 15', 'description': 'Electronic product', 'price': 668.07, 'category': 'Electronics', 'stock': 34, 'status': true, 'thumbnail': 'img70.jpg' },
    { 'code': 'P071', 'title': 'Contraption 49', 'description': 'Toy gadget', 'price': 715.42, 'category': 'Toys', 'stock': 34, 'status': true, 'thumbnail': 'img71.jpg' },
    { 'code': 'P072', 'title': 'Widget 28', 'description': 'Clothing item', 'price': 601.71, 'category': 'Clothing', 'stock': 18, 'status': true, 'thumbnail': 'img72.jpg' },
    { 'code': 'P073', 'title': 'Widget 6', 'description': 'Beauty item', 'price': 98.42, 'category': 'Beauty', 'stock': 20, 'status': true, 'thumbnail': 'img73.jpg' },
    { 'code': 'P074', 'title': 'Widget 67', 'description': 'Toys for kids', 'price': 52.61, 'category': 'Toys', 'stock': 1, 'status': true, 'thumbnail': 'img74.jpg' },
    { 'code': 'P075', 'title': 'Device 63', 'description': 'Sports device', 'price': 886.67, 'category': 'Sports', 'stock': 40, 'status': true, 'thumbnail': 'img75.jpg' },
    { 'code': 'P076', 'title': 'Contraption 47', 'description': 'Clothing accessory', 'price': 964.97, 'category': 'Clothing', 'stock': 28, 'status': true, 'thumbnail': 'img76.jpg' },
    { 'code': 'P077', 'title': 'Thingamajig 29', 'description': 'Fun toy for kids', 'price': 594.44, 'category': 'Toys', 'stock': 35, 'status': true, 'thumbnail': 'img77.jpg' },
    { 'code': 'P078', 'title': 'Contraption 54', 'description': 'Sports item', 'price': 268.36, 'category': 'Sports', 'stock': 22, 'status': true, 'thumbnail': 'img78.jpg' },
    { 'code': 'P079', 'title': 'Device 32', 'description': 'Sports device', 'price': 288.94, 'category': 'Sports', 'stock': 39, 'status': true, 'thumbnail': 'img79.jpg' },
    { 'code': 'P080', 'title': 'Widget 23', 'description': 'Furniture gadget', 'price': 716.14, 'category': 'Furniture', 'stock': 25, 'status': true, 'thumbnail': 'img80.jpg' }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        await Product.deleteMany({});
        console.log('Collection eliminada!');

        await Product.insertMany(products);
        console.log('Products agregados!');

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedDatabase();
