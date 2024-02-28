class CartService {
    constructor(db) {
        this.Cart = db.Cart;
    }

    async getAllCarts() {
        return this.Cart.findAll();
    }

    async createCart(cartDetails) {
        return this.Cart.create(cartDetails);
    }

    async updateCart(cartId, newCartDetails) {
        const existingCart = await this.Cart.findByPk(cartId);

        if (!existingCart) {
            throw new Error("Cart not found");
        }

        await existingCart.update(newCartDetails);
        return this.getCartById(cartId);
    }

    async getCartById(cartId) {
        return this.Cart.findByPk(cartId);
    }

    async deleteCart(cartId) {
        const deletedRowCount = await this.Cart.destroy({ where: { id: cartId } });
        if (deletedRowCount === 0) {
            throw new Error("Cart not found");
        }
    }
}

module.exports = CartService;
