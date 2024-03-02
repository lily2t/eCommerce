class MembershipService {
    constructor(db) {
        this.Membership = db.Membership;
    }

    async getAll() {
        return this.Membership.findAll();
    }

    async getById(membershipId) {
        return this.Membership.findByPk(membershipId);
    }

    async create(name, discount) {
        return this.Membership.create({ name, discount });
    }

    async update(membershipId, name, discount) {
        const [updatedRowsCount] = await this.Membership.update({ name, discount }, { where: { id: membershipId } });

        if (updatedRowsCount === 0) {
            throw new Error("Membership not found or not updated");
        }

        return this.getById(membershipId);
    }

    async delete(membershipId) {
        const membership = await this.getById(membershipId);

        if (!membership) {
            throw new Error("Membership not found");
        }

        await membership.destroy();
    }
}

module.exports = MembershipService;
