class CartService {
    constructor(db) {
        this.Cart = db.Cart;
    }

    async getByUserId(userId) {
        return this.Cart.findAll({ where: { userId } });
    }

    async addToCart(userId, productId, quantity) {
        return this.Cart.create({ userId, productId, quantity });
    }

    async updateCartItem(cartItemId, quantity) {
        const [updatedRowsCount] = await this.Cart.update({ quantity }, { where: { id: cartItemId } });

        if (updatedRowsCount === 0) {
            throw new Error("Cart item not found or not updated");
        }

        return this.getCartItemById(cartItemId);
    }

    async removeFromCart(cartItemId) {
        const cartItem = await this.getCartItemById(cartItemId);

        if (!cartItem) {
            throw new Error("Cart item not found");
        }

        await cartItem.destroy();
    }

    async getCartItemById(cartItemId) {
        return this.Cart.findByPk(cartItemId);
    }
}

module.exports = CartService;
