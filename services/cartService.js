class CartService {
    constructor(db) {
        this.Cart = db.Cart;
        this.Product = db.Product;
    }

    async addToCart(userId, productId, quantity) {
        const product = await this.Product.findByPk(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        if (product.quantity < quantity) {
            throw new Error("Product quantity not enough");
        }

        let cartItem = await this.Cart.findOne({ where: { UserId: userId, ProductId: productId } });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await this.Cart.create({
                UserId: userId,
                ProductId: productId,
                quantity: quantity,
                unitPrice: product.unitPrice
            });
        }

        return cartItem;
    }

    async getCartItems(userId) {
        return this.Cart.findAll({
            where: { UserId: userId },
            include: [{ model: this.Product }]
        });
    }

    async updateCartItem(cartItemId, quantity) {
        const cartItem = await this.Cart.findByPk(cartItemId);
        if (!cartItem) {
            throw new Error("Cart item not found");
        }

        const product = await this.Product.findByPk(cartItem.ProductId);
        if (!product) {
            throw new Error("Product not found");
        }

        if (product.quantity < quantity) {
            throw new Error("Product quantity not enough");
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        return cartItem;
    }

    async deleteCartItem(cartItemId) {
        const cartItem = await this.Cart.findByPk(cartItemId);
        if (!cartItem) {
            throw new Error("Cart item not found");
        }

        await cartItem.destroy();
        return cartItem;
    }
}

module.exports = CartService;
